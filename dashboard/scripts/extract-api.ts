import { Project, Node, SyntaxKind, ts } from 'ts-morph';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import { API_TARGETS, type CatalogTarget } from '../src/docs-system/catalog-targets';
import type { ApiMetadata, ApiPropertyMetadata, ExampleMetadata, ReleaseMetadata } from '../src/docs-system/metadata';
import { validateCatalogIntegrity } from '../src/docs-system/catalog-integrity';

export const ROOT = path.resolve(__dirname, '../..');
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

export function validateTargets(root: string, targets: readonly CatalogTarget[]) {
  const modules = new Set<string>();
  for (const target of targets) {
    if (!/^@skyra-tech-platform\/[a-z0-9-]+$/.test(target.packageId)) throw new Error(`Noncanonical target ${target.packageId}`);
    if (modules.has(target.exportPath)) throw new Error(`Duplicate target ${target.exportPath}`);
    modules.add(target.exportPath);
    const dir = path.join(root, 'packages', target.packageId.split('/')[1]!);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    if (manifest.name !== target.packageId) throw new Error(`Package identity mismatch ${target.packageId}`);
    const subpath = target.exportPath === target.packageId ? '.' : '.' + target.exportPath.slice(target.packageId.length);
    if (!target.exportPath.startsWith(target.packageId) || !manifest.exports?.[subpath]?.types) throw new Error(`Unknown declaration export ${target.exportPath}`);
    const entry = path.resolve(root, target.entry);
    if (entry !== path.resolve(dir, manifest.exports[subpath].types)) throw new Error(`Declaration target mismatch ${target.exportPath}`);
    if (!fs.existsSync(entry)) throw new Error(`Missing required declaration ${target.entry}; build ${target.packageId}`);
  }
}

function docs(node: Node) {
  if (Node.isVariableDeclaration(node)) return node.getVariableStatement()?.getJsDocs() ?? [];
  if (Node.isClassDeclaration(node) || Node.isFunctionDeclaration(node) || Node.isInterfaceDeclaration(node)
    || Node.isTypeAliasDeclaration(node) || Node.isEnumDeclaration(node) || Node.isPropertySignature(node)
    || Node.isPropertyDeclaration(node)) return node.getJsDocs();
  return [];
}

export function extractCatalog(root = ROOT, targets: readonly CatalogTarget[] = API_TARGETS): ApiMetadata[] {
  validateTargets(root, targets);
  const project = new Project({ compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true } });
  for (const target of targets) project.addSourceFileAtPath(path.resolve(root, target.entry));
  const records: ApiMetadata[] = [];
  for (const target of targets) {
    const source = project.getSourceFileOrThrow(path.resolve(root, target.entry));
    const exports = source.getExportedDeclarations();
    for (const reexport of source.getExportDeclarations()) {
      if (reexport.getModuleSpecifier() && !reexport.getModuleSpecifierSourceFile()) throw new Error(`Unresolved public re-export in ${target.entry}`);
      for (const named of reexport.getNamedExports()) {
        const name = named.getAliasNode()?.getText() ?? named.getName();
        if (!exports.get(name)?.length) throw new Error(`Unresolved public export ${target.exportPath}::${name}`);
      }
    }
    if (!exports.size) throw new Error(`No public exports in required declaration ${target.entry}`);
    for (const [name, declarations] of exports) {
      const node = declarations[0];
      if (!node) throw new Error(`Unresolved public export ${target.exportPath}::${name}`);
      let kind: ApiMetadata['kind'];
      const properties: ApiPropertyMetadata[] = [];
      let returnType: string | undefined;
      if (Node.isClassDeclaration(node)) kind = 'class';
      else if (Node.isFunctionDeclaration(node)) {
        kind = 'function';
        returnType = node.getReturnTypeNode()?.getText();
        for (const param of node.getParameters()) properties.push({ name: param.getName(),
          type: param.getTypeNode()?.getText() ?? param.getType().getText(param), required: !param.isOptional() });
      } else if (Node.isInterfaceDeclaration(node)) kind = 'interface';
      else if (Node.isTypeAliasDeclaration(node)) kind = 'type';
      else if (Node.isVariableDeclaration(node)) kind = 'constant';
      else if (Node.isEnumDeclaration(node)) kind = 'enum';
      else throw new Error(`Unsupported public declaration kind ${node.getKindName()} for ${name}`);
      if (Node.isInterfaceDeclaration(node) || Node.isClassDeclaration(node)) {
        for (const prop of node.getProperties()) {
          if (prop.hasModifier(SyntaxKind.PrivateKeyword) || prop.hasModifier(SyntaxKind.ProtectedKeyword)) continue;
          properties.push({ name: prop.getName(), type: prop.getTypeNode()?.getText() ?? prop.getType().getText(prop),
            required: !prop.hasQuestionToken(), description: docs(prop)[0]?.getDescription().trim() || '' });
        }
      }
      const comment = docs(node)[0];
      const deprecated = comment?.getTags().find(tag => tag.getTagName() === 'deprecated');
      records.push({ id: `${target.exportPath}::${name}`, name, packageId: target.packageId, exportPath: target.exportPath,
        capabilityId: target.capabilityId, catalogState: 'current', declarationPath: target.entry,
        kind, description: comment?.getDescription().trim() || '', status: deprecated ? 'deprecated' : 'stable',
        ...(deprecated ? { deprecation: { reason: deprecated.getCommentText() || 'Deprecated' } } : {}),
        signature: declarations.map(decl => decl.getText()).join('\n'), properties, ...(returnType ? { returnType } : {}), related: [] });
    }
  }
  records.sort((a, b) => compare(a.id, b.id));
  if (new Set(records.map(record => record.id)).size !== records.length) throw new Error('Duplicate API identity');
  return records;
}

export function archiveRecords(previous: ApiMetadata[], current: ApiMetadata[]): ApiMetadata[] {
  const ids = new Set(current.map(api => api.id)), packages = new Set(current.map(api => api.packageId));
  return previous.map(api => ({ ...api, catalogState: 'historical',
    historyReason: ids.has(api.id) ? 'superseded' : packages.has(api.packageId) ? 'unresolved-symbol' : 'retired-package' }));
}

export function validateExamples(current: ApiMetadata[], examples: ExampleMetadata[]) {
  const ids = new Set<string>();
  for (const example of examples) {
    if (ids.has(example.id)) throw new Error(`Duplicate example ${example.id}`);
    ids.add(example.id);
    const api = current.find(api => api.id === example.apiId);
    if (!api || example.packageId !== api.packageId || (example.capabilityId && example.capabilityId !== api.capabilityId)) throw new Error(`Invalid current example join ${example.id}`);
  }
}

export function readExampleAnnotations(root: string): ExampleMetadata[] {
  const result: ExampleMetadata[] = [];
  function visit(dir: string) {
    for (const file of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) visit(full);
      else if (/\.tsx?$/.test(file)) {
        const source = fs.readFileSync(full, 'utf8');
        const tag = (name: string) => source.match(new RegExp(`@${name}\\s+([^\\r\\n]+)`))?.[1]?.trim();
        result.push({ id: tag('id') || path.basename(file, path.extname(file)), title: tag('title') || file,
          apiId: tag('apiId'), packageId: tag('packageId'), capabilityId: tag('capabilityId'), source, language: file.endsWith('.tsx') ? 'tsx' : 'typescript' });
      }
    }
  }
  visit(path.join(root, 'dashboard/src/examples'));
  return result;
}

export function writeAtomic(file: string, contents: string, temporary = `${file}.${randomUUID()}.tmp`) {
  let owned = false;
  try {
    const descriptor = fs.openSync(temporary, 'wx');
    owned = true;
    try { fs.writeFileSync(descriptor, contents); } finally { fs.closeSync(descriptor); }
    fs.renameSync(temporary, file);
  } finally {
    if (owned && fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

export function generate(root = ROOT, file = path.join(root, 'dashboard/src/docs-system/data/apis.json'), check = false,
  targets: readonly CatalogTarget[] = API_TARGETS, beforeWrite: (records: ApiMetadata[]) => void = () => {}) {
  const records = extractCatalog(root, targets);
  validateExamples(records, readExampleAnnotations(root));
  beforeWrite(records);
  const contents = JSON.stringify(records, null, 2) + '\n';
  if (check) {
    if (fs.readFileSync(file, 'utf8') !== contents) throw new Error('API catalog is out of date; run extraction');
  } else if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== contents) writeAtomic(file, contents);
  return records;
}

export function validateRepositoryReferences(records: ApiMetadata[]) {
  const { capabilityDefinitions } = require('../src/docs-system/bootstrap') as typeof import('../src/docs-system/bootstrap');
  const { behavioralMetadataMap } = require('../src/docs-system/behavioral-metadata') as typeof import('../src/docs-system/behavioral-metadata');
  const { historicalBehavioralMetadataMap, unboundHistoricalBehaviorIds } = require('../src/docs-system/historical-behavioral-metadata') as typeof import('../src/docs-system/historical-behavioral-metadata');
  const data = path.join(ROOT, 'dashboard/src/docs-system/data');
  const historical: ApiMetadata[] = JSON.parse(fs.readFileSync(path.join(data, 'historical-apis.json'), 'utf8'));
  const capabilities: import('../src/docs-system/catalog-integrity').CatalogBundle['capabilities'] = capabilityDefinitions.map(cap => ({ ...cap, apis: [] }));
  for (const target of API_TARGETS) if (!capabilities.some(cap => cap.id === target.capabilityId)) {
    capabilities.push({ id: target.capabilityId, packageId: target.packageId, catalogState: 'current', apis: [] });
  }
  for (const api of [...records, ...historical]) {
    const cap = capabilities.find(cap => cap.id === api.capabilityId && cap.packageId === api.packageId);
    if (cap && (api.catalogState === 'historical') === (cap.catalogState === 'historical')) cap.apis.push(api.id);
  }
  const examples = readExampleAnnotations(ROOT).map(example => ({ ...example, catalogState: 'current' as const,
    capabilityId: records.find(api => api.id === example.apiId)!.capabilityId }));
  const releases: Record<string, ReleaseMetadata> = JSON.parse(fs.readFileSync(path.join(data, 'releases.json'), 'utf8'));
  validateCatalogIntegrity({ current: records, historical, examples,
    historicalExamples: JSON.parse(fs.readFileSync(path.join(data, 'historical-examples.json'), 'utf8')),
    capabilities, behavioralIds: Object.keys(behavioralMetadataMap),
    historicalBehavioralIds: Object.keys(historicalBehavioralMetadataMap), unboundHistoricalBehaviorIds,
    releaseApiIds: Object.values(releases).flatMap(release => release.packages.flatMap(pkg => pkg.changes.flatMap(change => change.apiIds || []))) });
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--check')) throw new Error('Usage: extract-api.ts [--check]');
    const records = generate(ROOT, undefined, args.includes('--check'), API_TARGETS, validateRepositoryReferences);
    console.log(`${args.includes('--check') ? 'Validated' : 'Extracted'} ${records.length} current APIs from ${API_TARGETS.length} published entry points`);
  } catch (error) { console.error(error); process.exitCode = 1; }
}
