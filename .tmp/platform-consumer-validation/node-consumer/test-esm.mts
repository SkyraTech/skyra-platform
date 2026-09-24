import { simpleId } from "@skyra/utils";
import { emailSchema } from "@skyra/validation";
import { exportToCsv } from "@skyra/data-export";
import { generateQRCode } from "@skyra/qr/core";

console.log("ESM @skyra/utils:", simpleId());
console.log("ESM @skyra/validation:", emailSchema.safeParse("test@example.com").success);
console.log("ESM @skyra/data-export:", typeof exportToCsv);
console.log("ESM @skyra/qr/core:", typeof generateQRCode);
