import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

// 1. Run the initial build of examples
console.log('Generating initial examples...');
const initialRun = spawn(process.execPath, [path.join(root, 'scripts', 'generate-examples.mjs')], { 
  cwd: root, 
  stdio: 'inherit'
});

initialRun.on('close', (code) => {
  if (code !== 0) {
    console.error('Failed to generate initial examples');
    process.exit(code);
  }

  // 2. Start the watcher for examples
  console.log('Starting examples watcher...');
  const watcher = spawn(process.execPath, ['--watch-path=./src/examples', path.join(root, 'scripts', 'generate-examples.mjs')], { 
    cwd: root, 
    stdio: 'inherit'
  });

  // 3. Start Next.js dev server using the resolved local Next CLI directly
  console.log('Starting Next.js dev server...');
  const nextProcess = spawn(process.execPath, [nextBin, 'dev', '--port', '3002'], { 
    cwd: root, 
    stdio: 'inherit'
  });

  const cleanup = () => {
    watcher.kill();
    nextProcess.kill();
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
});
