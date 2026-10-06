import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), '.tmp-consumer');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

try {
  console.log('Building and packing @skyra-tech-platform/dynamic-form...');
  execSync('pnpm build --filter @skyra-tech-platform/dynamic-form', { stdio: 'inherit' });
  execSync('pnpm pack', { cwd: path.join(process.cwd(), 'packages', 'dynamic-form'), stdio: 'inherit' });
  
  const tarballName = fs.readdirSync(path.join(process.cwd(), 'packages', 'dynamic-form')).find(f => f.endsWith('.tgz'));
  const tarballPath = path.join(process.cwd(), 'packages', 'dynamic-form', tarballName);
  
  console.log('Initializing consumer project...');
  fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({
    name: "consumer-test",
    type: "module",
    dependencies: {}
  }));
  
  console.log('Installing tarball...');
  execSync(`npm install ${tarballPath}`, { cwd: tempDir, stdio: 'inherit' });
  
  console.log('Testing import...');
  const testScript = `
    import '@skyra-tech-platform/dynamic-form';
    console.log('Import successful!');
    if (typeof HTMLElement !== 'undefined') {
       // Since it's node, we don't have HTMLElement or customElements by default 
       // but we check if the import didn't crash
    }
  `;
  fs.writeFileSync(path.join(tempDir, 'test.js'), testScript);
  execSync('node test.js', { cwd: tempDir, stdio: 'inherit' });
  
  console.log('Package isolation verified successfully!');
} catch (e) {
  console.error('Package isolation test failed:', e.message);
  process.exit(1);
}
