import { Project, VariableDeclaration, InterfaceDeclaration, TypeAliasDeclaration, FunctionDeclaration, ClassDeclaration, JSDoc } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

export interface TargetPackage {
  packageId: string;
  dir: string;
  entry: string;
  baselineFile?: string;
}

export interface ApiProperty {
  type: string;
  required: boolean;
}

export interface ApiEntry {
  kind: string;
  signature?: string;
  returnType?: string;
  properties: Record<string, ApiProperty>;
  deprecated: boolean;
}

export interface PackageJsonManifest {
  name: string;
  version: string;
  [key: string]: unknown;
}

/**
 * Canonical package targets under API governance.
 * Updated to reflect the canonical `@skyra-tech-platform/*` namespace and current package locations:
 * - `@skyra/data-table` -> `@skyra-tech-platform/data-table` in `packages/data-table`
 * - `@skyra/dynamic-form` -> `@skyra-tech-platform/dynamic-form` in `packages/dynamic-form`
 * - Former `@skyra/dialogs` -> `@skyra-tech-platform/dialog` in `packages/dialog`
 * - Former `@skyra/ui` -> Eliminated in commit 34e2c73 (decomposed into atomic framework-agnostic packages)
 * - `@skyra-tech-platform/qr` -> Core library entry at `packages/qr/dist/core.d.ts` with `qr-core-api-baseline.json`
 */
export const TARGETS: TargetPackage[] = [
  {
    packageId: '@skyra-tech-platform/app-shell',
    dir: 'packages/app-shell',
    entry: 'packages/app-shell/dist/index.d.ts',
    baselineFile: 'app-shell-api-baseline.json',
  },
  {
    packageId: '@skyra-tech-platform/data-export',
    dir: 'packages/data-export',
    entry: 'packages/data-export/dist/index.d.ts',
    baselineFile: 'data-export-api-baseline.json',
  },
  {
    packageId: '@skyra-tech-platform/data-table',
    dir: 'packages/data-table',
    entry: 'packages/data-table/dist/index.d.ts',
    baselineFile: 'data-table-api-baseline.json',
  },
  {
    packageId: '@skyra-tech-platform/dialog',
    dir: 'packages/dialog',
    entry: 'packages/dialog/dist/index.d.ts',
    baselineFile: 'dialog-api-baseline.json',
  },
  {
    packageId: '@skyra-tech-platform/dynamic-form',
    dir: 'packages/dynamic-form',
    entry: 'packages/dynamic-form/dist/index.d.ts',
    baselineFile: 'dynamic-form-api-baseline.json',
  },
  {
    packageId: '@skyra-tech-platform/qr',
    dir: 'packages/qr',
    entry: 'packages/qr/dist/core.d.ts',
    baselineFile: 'qr-core-api-baseline.json',
  },
  {
    packageId: '@skyra-tech-platform/utils',
    dir: 'packages/utils',
    entry: 'packages/utils/dist/index.d.ts',
    baselineFile: 'utils-api-baseline.json',
  },
  {
    packageId: '@skyra-tech-platform/validation',
    dir: 'packages/validation',
    entry: 'packages/validation/dist/index.d.ts',
    baselineFile: 'validation-api-baseline.json',
  },
];

/**
 * Validates target packages and ensures directories, manifests, and declaration files exist.
 */
export function validateTargets(rootDir: string, targets: TargetPackage[] = TARGETS): TargetPackage[] {
  for (const target of targets) {
    const pkgDirPath = path.resolve(rootDir, target.dir);
    if (!fs.existsSync(pkgDirPath)) {
      throw new Error(`Package directory not found: ${target.dir} (for ${target.packageId})`);
    }

    const pkgJsonPath = path.join(pkgDirPath, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) {
      throw new Error(`package.json not found in ${target.dir}`);
    }

    let pkgJson: PackageJsonManifest;
    try {
      pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    } catch (err) {
      throw new Error(`Malformed package.json in ${target.dir}: ${(err as Error).message}`);
    }

    if (pkgJson.name !== target.packageId) {
      throw new Error(`Package name mismatch in ${target.dir}: manifest has "${pkgJson.name}", target expects "${target.packageId}"`);
    }

    const entryPath = path.resolve(rootDir, target.entry);
    if (!fs.existsSync(entryPath)) {
      throw new Error(`Entry declaration file not found for ${target.packageId}: ${target.entry}. Run 'pnpm build' first.`);
    }
  }

  return targets;
}

export function getBaselinePath(rootDir: string, target: TargetPackage): string {
  if (target.baselineFile) {
    return path.resolve(rootDir, target.dir, target.baselineFile);
  }
  const folderName = path.basename(target.dir);
  return path.resolve(rootDir, target.dir, `${folderName}-api-baseline.json`);
}

function getJSDocInfo(node: { getJsDocs?: () => JSDoc[] }) {
  const jsdocs = node.getJsDocs ? node.getJsDocs() : [];
  if (!jsdocs || jsdocs.length === 0) return { description: '', deprecation: undefined };
  
  const doc = jsdocs[0] as JSDoc;
  const description = doc.getDescription().trim();
  
  let deprecation;
  const depTag = doc.getTags().find(t => t.getTagName() === 'deprecated');
  if (depTag) {
    deprecation = { reason: depTag.getCommentText() || 'Deprecated' };
  }
  
  return { description, deprecation };
}

export function extractAPI(project: Project, target: TargetPackage, rootDir: string = path.resolve(__dirname, '..')): Record<string, ApiEntry> {
  const fullEntryPath = path.resolve(rootDir, target.entry);
  const sourceFile = project.getSourceFile(fullEntryPath);
  if (!sourceFile) {
    throw new Error(`Entry file not loaded in project: ${target.entry}`);
  }
  
  const exported = sourceFile.getExportedDeclarations();
  const apis: Record<string, ApiEntry> = {};

  for (const [name, decls] of exported) {
    const decl = decls[0];
    const kindName = decl.getKindName();
    let apiKind = 'type';
    let signature = undefined;
    let returnType = undefined;
    const properties: Record<string, ApiProperty> = {};

    const { deprecation } = getJSDocInfo(decl);
    
    if (kindName === 'VariableDeclaration') {
      const varDecl = decl as VariableDeclaration;
      const typeNode = varDecl.getType();
      const typeText = typeNode.getText(decl);
      
      if (typeText.includes('React.ForwardRefExoticComponent') || typeText.includes('React.FC')) {
        apiKind = 'component';
      } else {
        apiKind = 'constant';
        signature = typeText;
      }
    } else if (kindName === 'FunctionDeclaration') {
      const fnDecl = decl as FunctionDeclaration;
      signature = fnDecl.getText().split('{')[0].trim();
      returnType = fnDecl.getReturnType().getText(decl);
      apiKind = 'function';
      
      if (returnType.includes('JSX.Element')) {
        apiKind = 'component';
      }
      
      fnDecl.getParameters().forEach(p => {
        properties[p.getName()] = {
          type: p.getType().getText(decl),
          required: !p.isOptional(),
        };
      });
    } else if (kindName === 'InterfaceDeclaration') {
      const intDecl = decl as InterfaceDeclaration;
      apiKind = 'interface';
      
      intDecl.getProperties().forEach(p => {
        properties[p.getName()] = {
          type: p.getType().getText(decl),
          required: !p.hasQuestionToken(),
        };
      });
    } else if (kindName === 'TypeAliasDeclaration') {
      const taDecl = decl as TypeAliasDeclaration;
      apiKind = 'type';
      signature = taDecl.getTypeNode()?.getText() || taDecl.getText();
    } else if (kindName === 'EnumDeclaration') {
      apiKind = 'enum';
      signature = decl.getText();
    } else if (kindName === 'ClassDeclaration') {
      const clsDecl = decl as ClassDeclaration;
      apiKind = 'class';
      signature = clsDecl.getText().split('{')[0].trim();
      clsDecl.getProperties().forEach(p => {
        properties[p.getName()] = {
          type: p.getType().getText(decl),
          required: true,
        };
      });
      clsDecl.getMethods().forEach(m => {
        properties[m.getName()] = {
          type: m.getReturnType().getText(decl),
          required: true,
        };
      });
    }
    
    apis[name] = {
      kind: apiKind,
      signature,
      returnType,
      properties,
      deprecated: !!deprecation,
    };
  }
  
  // Post process components to attach props if available
  for (const [name, api] of Object.entries(apis)) {
    if (api.kind === 'component') {
      const propsName = `${name}Props`;
      if (apis[propsName] && apis[propsName].kind === 'interface') {
        api.properties = { ...apis[propsName].properties };
      }
    }
  }

  // Sort keys deterministically
  const sortedApis: Record<string, ApiEntry> = {};
  Object.keys(apis).sort().forEach(k => {
    sortedApis[k] = apis[k];
  });
  
  return sortedApis;
}

export function updateBaselines(rootDir: string, targets: TargetPackage[] = TARGETS): void {
  const validated = validateTargets(rootDir, targets);
  const project = new Project();
  validated.forEach(t => {
    project.addSourceFileAtPath(path.resolve(rootDir, t.entry));
  });

  validated.forEach(target => {
    const api = extractAPI(project, target, rootDir);
    const outPath = getBaselinePath(rootDir, target);
    fs.writeFileSync(outPath, JSON.stringify(api, null, 2) + '\n');
    console.log(`Updated baseline for ${target.packageId} -> ${path.basename(outPath)}`);
  });
  console.log('✅ API baselines updated successfully.');
}

export function checkGovernance(rootDir: string, targets: TargetPackage[] = TARGETS): boolean {
  const validated = validateTargets(rootDir, targets);
  const project = new Project();
  validated.forEach(t => {
    project.addSourceFileAtPath(path.resolve(rootDir, t.entry));
  });

  let hasErrors = false;

  validated.forEach(target => {
    const baselinePath = getBaselinePath(rootDir, target);
    
    if (!fs.existsSync(baselinePath)) {
      console.error(`❌ Baseline not found for ${target.packageId} (${path.basename(baselinePath)}). Run 'pnpm api:update' to generate it.`);
      hasErrors = true;
      return;
    }

    const baseline: Record<string, ApiEntry> = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    const current = extractAPI(project, target, rootDir);
    
    const diffs: string[] = [];
    let isBreaking = false;

    // Check for removed APIs
    for (const apiName of Object.keys(baseline)) {
      if (!current[apiName]) {
        diffs.push(`- Removed API: ${apiName} (${baseline[apiName].kind})`);
        isBreaking = true;
      }
    }

    // Check for added or changed APIs
    for (const [apiName, currentApi] of Object.entries(current)) {
      const baselineApi = baseline[apiName];
      if (!baselineApi) {
        diffs.push(`+ Added API: ${apiName} (${currentApi.kind})`);
        continue;
      }

      // Check properties changes
      for (const [propName, prop] of Object.entries(currentApi.properties)) {
        const baseProp = baselineApi.properties ? baselineApi.properties[propName] : undefined;
        if (!baseProp) {
          diffs.push(`+ Added property: ${apiName}.${propName}`);
          if (prop.required) {
             diffs.push(`  ❌ Breaking: Added REQUIRED property ${propName} to ${apiName}`);
             isBreaking = true;
          }
        } else {
          if (prop.required && !baseProp.required) {
            diffs.push(`  ❌ Breaking: Property ${apiName}.${propName} became REQUIRED`);
            isBreaking = true;
          }
          if (prop.type !== baseProp.type) {
            diffs.push(`  ⚠️ Changed type of ${apiName}.${propName}: ${baseProp.type} -> ${prop.type}`);
            isBreaking = true;
          }
        }
      }

      if (baselineApi.properties) {
        for (const propName of Object.keys(baselineApi.properties)) {
          if (!currentApi.properties || !currentApi.properties[propName]) {
             diffs.push(`- Removed property: ${apiName}.${propName}`);
             isBreaking = true;
          }
        }
      }
      
      if (baselineApi.signature !== currentApi.signature) {
         diffs.push(`  ⚠️ Changed signature of ${apiName}`);
         isBreaking = true;
      }
    }

    if (diffs.length > 0) {
      console.log(`\n==================================================`);
      console.log(`📦 API Changes detected in ${target.packageId}`);
      console.log(`==================================================`);
      diffs.forEach(d => console.log(d));
      
      const pkgJsonPath = path.resolve(rootDir, target.dir, 'package.json');
      const pkgJson: PackageJsonManifest = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      const version = pkgJson.version;
      const isPre1 = version.startsWith('0.');
      
      const requiredBump = isBreaking ? (isPre1 ? 'minor' : 'major') : (isPre1 ? 'patch' : 'minor');
      
      console.log(`\nClassification: ${isBreaking ? 'BREAKING' : 'NON-BREAKING'}`);
      console.log(`Current version: ${version}`);
      console.log(`Expected bump: ${requiredBump}`);

      // Check changesets
      const changesetsDir = path.resolve(rootDir, '.changeset');
      let foundMatchingChangeset = false;
      if (fs.existsSync(changesetsDir)) {
         const files = fs.readdirSync(changesetsDir).filter(f => f.endsWith('.md') && f !== 'README.md');
         for (const file of files) {
           const content = fs.readFileSync(path.join(changesetsDir, file), 'utf8');
           const match = content.match(/---\n([\s\S]*?)\n---/);
           if (match) {
             const fm = match[1];
             if (fm.includes(`'${pkgJson.name}': ${requiredBump}`) || fm.includes(`"${pkgJson.name}": ${requiredBump}`)) {
               foundMatchingChangeset = true;
               break;
             }
             if (requiredBump === 'minor' && (fm.includes(`'${pkgJson.name}': major`) || fm.includes(`"${pkgJson.name}": major`))) {
               foundMatchingChangeset = true;
               break;
             }
           }
         }
      }

      if (!foundMatchingChangeset) {
        if (isBreaking) {
          console.error(`❌ Missing appropriate Changeset for ${pkgJson.name}. Required: ${requiredBump}`);
          console.error(`Action: Create/update a Changeset describing the breaking change.`);
          console.error(`Then update the committed API baseline intentionally using 'pnpm api:update'.\n`);
          hasErrors = true;
        } else {
          console.warn(`⚠️ No Changeset found for non-breaking API changes in ${pkgJson.name}.`);
          console.warn(`If this change should be released, consider adding a Changeset.`);
          console.warn(`Otherwise, update the committed API baseline using 'pnpm api:update'.\n`);
        }
      } else {
        console.log(`✅ Found valid Changeset.`);
      }
    }
  });

  return !hasErrors;
}

const isMain = process.argv[1] && (
  process.argv[1].endsWith('api-governance.ts') ||
  process.argv[1].endsWith('api-governance.js')
);

if (isMain) {
  const rootDir = path.resolve(__dirname, '..');
  const command = process.argv[2];

  if (command === 'update') {
    updateBaselines(rootDir, TARGETS);
    process.exit(0);
  } else if (command === 'check') {
    const success = checkGovernance(rootDir, TARGETS);
    if (!success) {
      process.exit(1);
    } else {
      console.log('✅ All API governance checks passed.');
      process.exit(0);
    }
  } else {
    console.log('Usage: npx tsx scripts/api-governance.ts <update|check>');
    process.exit(1);
  }
}
