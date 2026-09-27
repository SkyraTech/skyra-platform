import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXAMPLES_DIR = path.join(__dirname, '../src/examples');
const OUTPUT_DATA_DIR = path.join(__dirname, '../src/docs-system/data');
const OUTPUT_JSON = path.join(OUTPUT_DATA_DIR, 'examples.json');
const OUTPUT_MAPPING = path.join(__dirname, '../src/docs-system/example-components.ts');
const APIS_JSON = path.join(OUTPUT_DATA_DIR, 'apis.json');

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function run() {
  try {
    await fs.mkdir(EXAMPLES_DIR, { recursive: true });
    await fs.mkdir(OUTPUT_DATA_DIR, { recursive: true });
    
    let allFiles;
    try {
      allFiles = await getFiles(EXAMPLES_DIR);
    } catch (e) {
      console.warn('No examples found or directory missing.');
      allFiles = [];
    }

    let apis = [];
    try {
      apis = JSON.parse(await fs.readFile(APIS_JSON, 'utf-8'));
    } catch (e) {
      console.warn('apis.json not found, skipping api existence validation.');
    }
    
    const validApiIds = new Set(apis.map(a => a.id));
    const validPackageIds = new Set(apis.map(a => a.packageId));
    const validCapabilityIds = new Set(apis.map(a => a.capabilityId).filter(Boolean));

    const examplesMetadata = [];
    let mappingCode = `// GENERATED FILE - DO NOT EDIT MANUALLY\n`;
    mappingCode += `// Maps Example IDs to their trusted React components.\n\n`;
    
    const imports = [];
    const mappingEntries = [];
    const seenIds = new Set();

    for (const filePath of allFiles) {
      if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) continue;
      
      const content = await fs.readFile(filePath, 'utf-8');
      
      // We parse a simple frontmatter-like comment block at the top if present, 
      // or we just define standard tags via JSDoc.
      // E.g.:
      // /**
      //  * @id ui-button-basic
      //  * @title Basic Button
      //  * @apiId @skyra/ui::Button
      //  */
      
      const idMatch = content.match(/@id\s+([^\r\n]+)/);
      const titleMatch = content.match(/@title\s+([^\r\n]+)/);
      const apiIdMatch = content.match(/@apiId\s+([^\r\n]+)/);
      const packageIdMatch = content.match(/@packageId\s+([^\r\n]+)/);
      const capIdMatch = content.match(/@capabilityId\s+([^\r\n]+)/);
      
      const id = idMatch ? idMatch[1].trim() : path.basename(filePath, path.extname(filePath));
      const title = titleMatch ? titleMatch[1].trim() : id;
      const apiId = apiIdMatch ? apiIdMatch[1].trim() : undefined;
      const packageId = packageIdMatch ? packageIdMatch[1].trim() : undefined;
      const capabilityId = capIdMatch ? capIdMatch[1].trim() : undefined;
      
      // VALIDATION
      if (seenIds.has(id)) throw new Error(`Duplicate example ID found: ${id}`);
      seenIds.add(id);
      
      if (apiId && validApiIds.size > 0 && !validApiIds.has(apiId)) throw new Error(`Referenced API does not exist: ${apiId} in ${id}`);
      if (packageId && validPackageIds.size > 0 && !validPackageIds.has(packageId)) throw new Error(`Referenced package does not exist: ${packageId} in ${id}`);
      if (capabilityId && validCapabilityIds.size > 0 && !validCapabilityIds.has(capabilityId)) throw new Error(`Referenced capability does not exist: ${capabilityId} in ${id}`);
      
      const isReactComponent = filePath.endsWith('.tsx');
      if (isReactComponent && !content.includes('export default')) {
        throw new Error(`React example ${id} must have a default export renderable component`);
      }
      
      const relativePath = path.relative(path.dirname(OUTPUT_MAPPING), filePath).replace(/\\/g, '/');
      const importPath = relativePath.replace(/\.tsx?$/, '');
      const componentName = `Example_${id.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      examplesMetadata.push({
        id,
        title,
        source: content,
        language: isReactComponent ? 'tsx' : 'typescript',
        apiId,
        packageId,
        capabilityId
      });
      
      if (isReactComponent) {
        imports.push(`import ${componentName} from '${importPath}';`);
        mappingEntries.push(`  '${id}': ${componentName},`);
      }
    }
    
    mappingCode += imports.join('\n') + '\n\n';
    mappingCode += `export const exampleComponents: Record<string, React.ComponentType<any>> = {\n${mappingEntries.join('\n')}\n};\n`;
    
    const newJson = JSON.stringify(examplesMetadata, null, 2);
    let currentJson = '';
    try { currentJson = await fs.readFile(OUTPUT_JSON, 'utf-8'); } catch(e) {}
    if (currentJson !== newJson) {
      await fs.writeFile(OUTPUT_JSON, newJson);
    }
    
    let currentMapping = '';
    try { currentMapping = await fs.readFile(OUTPUT_MAPPING, 'utf-8'); } catch(e) {}
    if (currentMapping !== mappingCode) {
      await fs.writeFile(OUTPUT_MAPPING, mappingCode);
    }
    
    console.log(`Successfully generated metadata for ${examplesMetadata.length} examples.`);
  } catch (err) {
    console.error('Failed to generate examples', err);
    process.exit(1);
  }
}

run();
