const fs = require('fs');
const path1 = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-table/src/skyra-tech-data-table.ts';
let content1 = fs.readFileSync(path1, 'utf8');

// Replace `const id = col.id || col.accessor;` with `const id = (col.id || col.accessor) as string;`
content1 = content1.replace(/const id = col\.id \|\| col\.accessor;/g, 'const id = (col.id || col.accessor) as string;');

// Fix col.size to col.width (from BaseColumnDef)
content1 = content1.replace(/col\.size \|\| 150/g, '(col.width as number) || 150');

// Fix String(row.id) issues with test assertions
fs.writeFileSync(path1, content1);

const path2 = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-table/src/skyra-tech-data-table.test.ts';
let content2 = fs.readFileSync(path2, 'utf8');

// Fix `expect(rows[0]?.querySelectorAll("td")[0]?.textContent)` which errors on optional chaining
content2 = content2.replace(/\?\./g, '.'); // Remove the optional chaining, tests run in JSDOM so it exists

fs.writeFileSync(path2, content2);
console.log("Done");
