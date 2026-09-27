import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// 1. Run the initial build of examples
console.log('Generating initial examples...');
const initialRun = spawn('node', ['scripts/generate-examples.mjs'], { 
  cwd: root, 
  stdio: 'inherit',
  shell: true 
});

initialRun.on('close', (code) => {
  if (code !== 0) {
    console.error('Failed to generate initial examples');
    process.exit(code);
  }

  // 2. Start the watcher for examples
  console.log('Starting examples watcher...');
  const watcher = spawn('node', ['--watch-path=./src/examples', 'scripts/generate-examples.mjs'], { 
    cwd: root, 
    stdio: 'inherit',
    shell: true 
  });

  // 3. Start Next.js dev server
  console.log('Starting Next.js dev server...');
  const nextProcess = spawn('npx', ['next', 'dev', '--port', '3001'], { 
    cwd: root, 
    stdio: 'inherit',
    shell: true 
  });

  const cleanup = () => {
    watcher.kill();
    nextProcess.kill();
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
});
