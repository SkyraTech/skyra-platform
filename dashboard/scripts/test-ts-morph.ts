import { Project } from 'ts-morph';
import * as path from 'path';

const project = new Project();
const sourceFile = project.addSourceFileAtPath(path.resolve(__dirname, '../../packages/ui/dist/index.d.ts'));

const exports = sourceFile.getExportedDeclarations();

for (const [name, decls] of exports) {
  const decl = decls[0];
  const kindName = decl.getKindName();
  console.log(`Export: ${name} (${kindName})`);
  
  if (kindName === 'VariableDeclaration') {
    // Usually React components are exported as const MyComp = React.forwardRef(...)
    const type = decl.getType();
    console.log(`  Type: ${type.getText(decl)}`);
  } else if (kindName === 'InterfaceDeclaration') {
    // Maybe an interface is exported directly
  }
}
