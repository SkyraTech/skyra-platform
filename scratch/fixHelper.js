const fs = require('fs');

function replaceFile(path, regex, repl) {
  let c = fs.readFileSync(path, 'utf8');
  c = c.replace(regex, repl);
  fs.writeFileSync(path, c);
}

replaceFile('dashboard/src/components/demos/MiscDemo.tsx', /helper="/g, 'helper-text="');
replaceFile('dashboard/src/app/(dashboard)/components/basic-controls/checkbox/page.tsx', /helper="/g, 'helper-text="');
replaceFile('dashboard/src/app/(dashboard)/components/basic-controls/radio/page.tsx', /helper="/g, 'helper-text="');
replaceFile('dashboard/src/components/demos/InputDemo.tsx', /helper="/g, 'helper-text="');
