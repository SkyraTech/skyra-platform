const fs = require('fs');
const path = require('path');

const pkgs = fs.readdirSync('packages');
const out = [];

for (const p of pkgs) {
  const pPath = path.join('packages', p, 'package.json');
  if (!fs.existsSync(pPath)) continue;
  
  const pkg = JSON.parse(fs.readFileSync(pPath, 'utf8'));
  
  // Find JSX/React in source files
  let hasReact = false;
  let hasJSX = false;
  let hasDOM = false;
  
  const srcPath = path.join('packages', p, 'src');
  if (fs.existsSync(srcPath)) {
    const files = fs.readdirSync(srcPath, { recursive: true });
    for (const f of files) {
      if (typeof f === 'string' && f.endsWith('.tsx')) hasJSX = true;
      if (typeof f === 'string' && (f.endsWith('.ts') || f.endsWith('.tsx'))) {
        const content = fs.readFileSync(path.join(srcPath, f), 'utf8');
        if (content.includes('import React') || content.includes("from 'react'") || content.includes('ReactNode') || content.includes('ReactElement')) {
          hasReact = true;
        }
        if (content.includes('window.') || content.includes('document.') || content.includes('HTMLElement')) {
          hasDOM = true;
        }
      }
    }
  }

  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.peerDependencies || {}) };
  const fwDeps = [];
  if (allDeps.react) fwDeps.push('react');
  if (allDeps.next) fwDeps.push('next');

  out.push({
    path: 'packages/' + p,
    name: pkg.name,
    purpose: pkg.description || 'No description',
    frameworkDeps: fwDeps.join(', ') || 'None',
    runtimeDeps: Object.keys(pkg.dependencies || {}).join(', ') || 'None',
    hasReact,
    hasJSX,
    hasDOM,
    isFrameworkIndependent: fwDeps.length === 0 && !hasReact && !hasJSX
  });
}

console.log(JSON.stringify(out, null, 2));
