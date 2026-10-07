const fs = require('fs');
const path = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-table/src/skyra-tech-data-table.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/private _data: any\[\] = \[\];/g, 'private _data: Record<string, unknown>[] = [];');
content = content.replace(/private _columns: any\[\] = \[\];/g, 'private _columns: BaseColumnDef<Record<string, unknown>, unknown>[] = [];');
content = content.replace(/private _isRowDisabled\?: \(row: any\) => boolean;/g, 'private _isRowDisabled?: (row: Record<string, unknown>) => boolean;');
content = content.replace(/private _processedData: any\[\] = \[\];/g, 'private _processedData: Record<string, unknown>[] = [];');
content = content.replace(/private _pageRows: any\[\] = \[\];/g, 'private _pageRows: Record<string, unknown>[] = [];');
content = content.replace(/set data\(val: any\[\]\)/g, 'set data(val: Record<string, unknown>[])');
content = content.replace(/set columns\(val: any\[\]\)/g, 'set columns(val: BaseColumnDef<Record<string, unknown>, unknown>[])');
content = content.replace(/set isRowDisabled\(val: \(\(row: any\) => boolean\) \| undefined\)/g, 'set isRowDisabled(val: ((row: Record<string, unknown>) => boolean) | undefined)');

fs.writeFileSync(path, content);
console.log("Done");
