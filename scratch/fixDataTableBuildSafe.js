const fs = require('fs');
const path1 = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-table/src/skyra-tech-data-table.ts';
let content1 = fs.readFileSync(path1, 'utf8');

if (!content1.includes('BaseColumnDef')) {
    content1 = content1.replace('import { \\n  DataTableFeatures, ', 'import { \\n  BaseColumnDef,\\n  DataTableFeatures, ');
    content1 = content1.replace('import { \n  DataTableFeatures, ', 'import { \n  BaseColumnDef,\n  DataTableFeatures, ');
}

// Ensure BaseColumnDef is imported correctly
if (content1.includes('BaseColumnDef') && !content1.includes('BaseColumnDef,')) {
    content1 = content1.replace(/import \{([^}]+)\} from '\.\/types';/, function(match, p1) {
       if (!p1.includes('BaseColumnDef')) {
           return "import { BaseColumnDef, " + p1.trim() + " } from './types';";
       }
       return match;
    });
}

content1 = content1.replace(/r\.id/g, 'String(r.id)');
content1 = content1.replace(/row\.id/g, 'String(row.id)');

fs.writeFileSync(path1, content1);

const path2 = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-table/src/skyra-tech-data-table.test.ts';
let content2 = fs.readFileSync(path2, 'utf8');

content2 = content2.replace(/\(row\) => \`slot-name-\${row\.id}\`/g, '(row: any) => \`slot-name-\${row.id}\`');
content2 = content2.replace(/expect\(headers\[0\]\.textContent\)/g, 'expect(headers[0]?.textContent)');
content2 = content2.replace(/expect\(headers\[1\]\.textContent\)/g, 'expect(headers[1]?.textContent)');
content2 = content2.replace(/expect\(rows\[0\]\.querySelectorAll\('td'\)\[0\]\.textContent\)/g, 'expect(rows[0]?.querySelectorAll("td")[0]?.textContent)');
content2 = content2.replace(/expect\(rows\[0\]\.querySelectorAll\('td'\)\[1\]\.textContent\)/g, 'expect(rows[0]?.querySelectorAll("td")[1]?.textContent)');
content2 = content2.replace(/expect\(rows\[0\]\.querySelector\('\.skyra-skeleton-bar'\)\)/g, 'expect(rows[0]?.querySelector(".skyra-skeleton-bar"))');
content2 = content2.replace(/expect\(cells\[0\]\.textContent\)/g, 'expect(cells[0]?.textContent)');
content2 = content2.replace(/expect\(rows\[0\]\.querySelector\('td'\)\.textContent\)/g, 'expect(rows[0]?.querySelector("td")?.textContent)');
content2 = content2.replace(/expect\(rows\[0\]\.querySelector\('td'\)!\.textContent\)/g, 'expect(rows[0]?.querySelector("td")?.textContent)');

fs.writeFileSync(path2, content2);
console.log("Done");
