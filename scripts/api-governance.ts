import { Project, VariableDeclaration, InterfaceDeclaration, TypeAliasDeclaration, FunctionDeclaration, SyntaxKind, JSDoc } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const TARGETS = [
  { packageId: '@skyra-tech-platform/app-shell', dir: 'packages/app-shell', entry: 'packages/app-shell/dist/index.d.ts' },
  { packageId: '@skyra-tech-platform/data-export', dir: 'packages/data-export', entry: 'packages/data-export/dist/index.d.ts' },
  { packageId: '@skyra/data-table', dir: 'packages/data-table', entry: 'packages/data-table/dist/index.d.ts' },
  { packageId: '@skyra/dialogs', dir: 'packages/dialogs', entry: 'packages/dialogs/dist/index.d.ts' },
  { packageId: '@skyra/dynamic-form', dir: 'packages/dynamic-form', entry: 'packages/dynamic-form/dist/index.d.ts' },
  { packageId: '@skyra/qr/core', dir: 'packages/qr', entry: 'packages/qr/dist/core.d.ts' },
  { packageId: '@skyra/qr/react', dir: 'packages/qr', entry: 'packages/qr/dist/react.d.ts' },
  { packageId: '@skyra/ui', dir: 'packages/ui', entry: 'packages/ui/dist/index.d.ts' },
  { packageId: '@skyra-tech-platform/utils', dir: 'packages/utils', entry: 'packages/utils/dist/index.d.ts' },
  { packageId: '@skyra-tech-platform/validation', dir: 'packages/validation', entry: 'packages/validation/dist/index.d.ts' },
];

function getJSDocInfo(node: any) {
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

function extractAPI(project: Project, target: typeof TARGETS[0]) {
  const sourceFile = project.getSourceFile(path.resolve(__dirname, '../', target.entry));
  if (!sourceFile) {
    throw new Error(`Entry file not found: ${target.entry}`);
  }
  
  const exported = sourceFile.getExportedDeclarations();
  const apis: Record<string, any> = {};

  for (const [name, decls] of exported) {
    const decl = decls[0];
    const kindName = decl.getKindName();
    let apiKind = 'type';
    let signature = undefined;
    let returnType = undefined;
    const properties: Record<string, any> = {};

    const { description, deprecation } = getJSDocInfo(decl);
    
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
      // simplified enum extraction
      signature = decl.getText();
    }
    
    apis[name] = {
      kind: apiKind,
      signature,
      returnType,
      properties,
      deprecated: !!deprecation
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
  const sortedApis: Record<string, any> = {};
  Object.keys(apis).sort().forEach(k => {
    sortedApis[k] = apis[k];
  });
  
  return sortedApis;
}

const command = process.argv[2];

if (command === 'update') {
  const project = new Project();
  TARGETS.forEach(t => {
    project.addSourceFileAtPath(path.resolve(__dirname, '../', t.entry));
  });

  TARGETS.forEach(target => {
    const api = extractAPI(project, target);
    // Determine baseline file name based on packageId for qr
    const safeName = target.packageId.replace('@skyra/', '').replace('/', '-');
    const outPath = path.resolve(__dirname, '../', target.dir, `${safeName}-api-baseline.json`);
    fs.writeFileSync(outPath, JSON.stringify(api, null, 2) + '\n');
    console.log(`Updated baseline for ${target.packageId}`);
  });
  console.log('✅ API baselines updated successfully.');
  process.exit(0);
}

if (command === 'check') {
  const project = new Project();
  TARGETS.forEach(t => {
    project.addSourceFileAtPath(path.resolve(__dirname, '../', t.entry));
  });

  let hasErrors = false;

  TARGETS.forEach(target => {
    const safeName = target.packageId.replace('@skyra/', '').replace('/', '-');
    const baselinePath = path.resolve(__dirname, '../', target.dir, `${safeName}-api-baseline.json`);
    
    if (!fs.existsSync(baselinePath)) {
      console.error(`❌ Baseline not found for ${target.packageId}. Run 'pnpm api:update' to generate it.`);
      hasErrors = true;
      return;
    }

    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    const current = extractAPI(project, target);
    
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
      for (const [propName, prop] of Object.entries(currentApi.properties as Record<string, any>)) {
        const baseProp = baselineApi.properties[propName];
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
            // Could be breaking, we mark as breaking to be safe for now
            isBreaking = true;
          }
        }
      }

      for (const [propName, baseProp] of Object.entries(baselineApi.properties as Record<string, any>)) {
        if (!currentApi.properties[propName]) {
           diffs.push(`- Removed property: ${apiName}.${propName}`);
           isBreaking = true;
        }
      }
      
      if (baselineApi.signature !== currentApi.signature) {
         diffs.push(`  ⚠️ Changed signature of ${apiName}`);
         isBreaking = true; // Conservative
      }
    }

    if (diffs.length > 0) {
      console.log(`\n==================================================`);
      console.log(`📦 API Changes detected in ${target.packageId}`);
      console.log(`==================================================`);
      diffs.forEach(d => console.log(d));
      
      const pkgJsonPath = path.resolve(__dirname, '../', target.dir, 'package.json');
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      const version = pkgJson.version;
      const isPre1 = version.startsWith('0.');
      
      const requiredBump = isBreaking ? (isPre1 ? 'minor' : 'major') : (isPre1 ? 'patch' : 'minor');
      
      console.log(`\nClassification: ${isBreaking ? 'BREAKING' : 'NON-BREAKING'}`);
      console.log(`Current version: ${version}`);
      console.log(`Expected bump: ${requiredBump}`);

      // Check changesets
      const changesetsDir = path.resolve(__dirname, '../.changeset');
      let foundMatchingChangeset = false;
      if (fs.existsSync(changesetsDir)) {
         const files = fs.readdirSync(changesetsDir).filter(f => f.endsWith('.md') && f !== 'README.md');
         for (const file of files) {
           const content = fs.readFileSync(path.join(changesetsDir, file), 'utf8');
           // Very simple frontmatter parsing
           const match = content.match(/---\n([\s\S]*?)\n---/);
           if (match) {
             const fm = match[1];
             if (fm.includes(`'${pkgJson.name}': ${requiredBump}`) || fm.includes(`"${pkgJson.name}": ${requiredBump}`)) {
               foundMatchingChangeset = true;
               break;
             }
             // For post-1.0 if breaking, major is required. 
             if (requiredBump === 'minor' && (fm.includes(`'${pkgJson.name}': major`) || fm.includes(`"${pkgJson.name}": major`))) {
               foundMatchingChangeset = true; // a higher bump is also acceptable
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

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log('✅ All API governance checks passed.');
    process.exit(0);
  }
}

console.log('Usage: npx tsx scripts/api-governance.ts <update|check>');
process.exit(1);
