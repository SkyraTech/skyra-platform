import { Project, VariableDeclaration, InterfaceDeclaration, TypeAliasDeclaration, FunctionDeclaration, SyntaxKind, JSDoc } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

// Define target extraction map
// We map exportPath -> package path and entry file
const TARGETS = [
  { capabilityId: 'app-shell/layout', packageId: '@skyra/app-shell', exportPath: '@skyra/app-shell', entry: 'packages/app-shell/dist/index.d.ts' },
  { capabilityId: 'data-export/csv', packageId: '@skyra/data-export', exportPath: '@skyra/data-export', entry: 'packages/data-export/dist/index.d.ts' },
  { capabilityId: 'data-table/dynamic', packageId: '@skyra/data-table', exportPath: '@skyra/data-table', entry: 'packages/data-table/dist/index.d.ts' },
  { capabilityId: 'dialogs/core', packageId: '@skyra/dialogs', exportPath: '@skyra/dialogs', entry: 'packages/dialogs/dist/index.d.ts' },
  { capabilityId: 'dynamic-form/core', packageId: '@skyra/dynamic-form', exportPath: '@skyra/dynamic-form', entry: 'packages/dynamic-form/dist/index.d.ts' },
  { capabilityId: 'qr/core', packageId: '@skyra/qr', exportPath: '@skyra/qr/core', entry: 'packages/qr/dist/core.d.ts' },
  { capabilityId: 'qr/react', packageId: '@skyra/qr', exportPath: '@skyra/qr/react', entry: 'packages/qr/dist/react.d.ts' },
  { capabilityId: 'ui/components', packageId: '@skyra/ui', exportPath: '@skyra/ui', entry: 'packages/ui/dist/index.d.ts' },
  { capabilityId: 'utils/core', packageId: '@skyra/utils', exportPath: '@skyra/utils', entry: 'packages/utils/dist/index.d.ts' },
  { capabilityId: 'validation/core', packageId: '@skyra/validation', exportPath: '@skyra/validation', entry: 'packages/validation/dist/index.d.ts' },
];

const project = new Project();

// Add all entry files to project
TARGETS.forEach(t => {
  project.addSourceFileAtPath(path.resolve(__dirname, '../../', t.entry));
});

const apis: any[] = [];

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

for (const target of TARGETS) {
  const sourceFile = project.getSourceFileOrThrow(path.resolve(__dirname, '../../', target.entry));
  const exported = sourceFile.getExportedDeclarations();
  
  for (const [name, decls] of exported) {
    const decl = decls[0];
    const kindName = decl.getKindName();
    let apiKind = 'type';
    let signature = undefined;
    let returnType = undefined;
    const properties: any[] = [];
    let isReactComponent = false;

    const { description, deprecation } = getJSDocInfo(decl);
    
    if (kindName === 'VariableDeclaration') {
      const varDecl = decl as VariableDeclaration;
      const typeNode = varDecl.getType();
      const typeText = typeNode.getText(decl);
      
      if (typeText.includes('React.ForwardRefExoticComponent') || typeText.includes('React.FC')) {
        apiKind = 'component';
        isReactComponent = true;
      } else {
        apiKind = 'constant';
      }
    } else if (kindName === 'FunctionDeclaration') {
      const fnDecl = decl as FunctionDeclaration;
      signature = fnDecl.getText();
      // Extremely basic signature simplification for display
      signature = signature.split('{')[0].trim();
      returnType = fnDecl.getReturnType().getText(decl);
      apiKind = 'function';
      
      if (returnType.includes('JSX.Element')) {
        apiKind = 'component';
      }
      
      fnDecl.getParameters().forEach(p => {
        const pDoc = getJSDocInfo(p);
        properties.push({
          name: p.getName(),
          type: p.getType().getText(decl),
          required: !p.isOptional(),
          description: pDoc.description
        });
      });
    } else if (kindName === 'InterfaceDeclaration') {
      const intDecl = decl as InterfaceDeclaration;
      apiKind = 'interface';
      
      intDecl.getProperties().forEach(p => {
        const pDoc = getJSDocInfo(p);
        properties.push({
          name: p.getName(),
          type: p.getType().getText(decl),
          required: !p.hasQuestionToken(),
          description: pDoc.description
        });
      });
    } else if (kindName === 'TypeAliasDeclaration') {
      const taDecl = decl as TypeAliasDeclaration;
      apiKind = 'type';
      signature = taDecl.getText();
    }
    
    apis.push({
      id: `${target.packageId}::${name}`,
      name,
      packageId: target.packageId,
      capabilityId: target.capabilityId,
      exportPath: target.exportPath,
      kind: apiKind,
      description: description || '',
      status: deprecation ? 'deprecated' : 'stable',
      deprecation,
      signature,
      properties,
      returnType,
      related: []
    });
  }
}

// Post-processing: Map component props back to the component for rendering
apis.forEach(api => {
  if (api.kind === 'component') {
    const propsInterfaceName = `${api.name}Props`;
    const propsInterface = apis.find(a => a.name === propsInterfaceName && a.packageId === api.packageId);
    if (propsInterface && api.properties.length <= 1) {
      // Overwrite the simple generic param list with the actual interface properties
      api.properties = [...propsInterface.properties];
      api.signature = `declare const ${api.name}: React.FC<${propsInterfaceName}>`;
    }
  }
});

const outPath = path.resolve(__dirname, '../src/docs-system/data/apis.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(apis, null, 2));

console.log(`Extracted ${apis.length} APIs to ${outPath}`);
