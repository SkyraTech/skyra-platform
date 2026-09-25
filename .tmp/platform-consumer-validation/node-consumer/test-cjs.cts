const { simpleId } = require("@skyra/utils");
const { emailSchema } = require("@skyra/validation");
const dataExport = require("@skyra/data-export");
const { generateQRCode } = require("@skyra/qr/core");

console.log("CJS @skyra/utils:", simpleId());
console.log("CJS @skyra/validation:", emailSchema.safeParse("test@example").success);
console.log("CJS @skyra/data-export:", typeof dataExport.exportToCsv);
console.log("CJS @skyra/qr/core:", typeof generateQRCode);
