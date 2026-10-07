const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', 'utf8');

content = content.replace(/skyra-qr-codeConfigurator/g, 'QRCodeConfigurator');
content = content.replace(/skyra-qr-codePreview/g, 'QRCodePreview');
content = content.replace(/skyra-qr-codeScanabilityStatus/g, 'QRCodeScanabilityStatus');

fs.writeFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', content);
