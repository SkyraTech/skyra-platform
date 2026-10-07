const fs = require('fs');
const file = 'dashboard/src/app/(dashboard)/qr-code/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/@skyra\/qr/g, '@skyra-tech-platform/qr');
content = content.replace(/import { QRCode } from '@skyra-tech-platform\/qr';/, "import '@skyra-tech-platform/qr';");
content = content.replace(/<QRCode/g, '<skyra-qr-code');
content = content.replace(/<\/QRCode>/g, '</skyra-qr-code>');
content = content.replace(/<span style={{ color: '#FDE047' }}>QRCode<\/span>/g, "<span style={{ color: '#FDE047' }}>skyra-qr-code</span>");
content = content.replace(/<span style={{ color: '#64748B' }}>\/\/ React Usage<\/span>/g, "<span style={{ color: '#64748B' }}>// Web Component Usage</span>");

// We need to convert the color prop to color-dark and color-light strings
content = content.replace(
  /{'  '}<span style={{ color: '#38BDF8' }}>color<\/span>=\{'{'}\{' \}\n{'    '}<span style={{ color: '#38BDF8' }}>dark<\/span>: <span style={{ color: '#34D399' }}>'\{darkColor\}'<\/span>,\n{'    '}<span style={{ color: '#38BDF8' }}>light<\/span>: <span style={{ color: '#34D399' }}>'\{lightColor\}'<\/span>\n{'  '}\}\}'\}'/g,
  `{'  '}<span style={{ color: '#38BDF8' }}>color-dark</span>={'{'}<span style={{ color: '#34D399' }}>'{darkColor}'</span>{'}'}\n{'  '}<span style={{ color: '#38BDF8' }}>color-light</span>={'{'}<span style={{ color: '#34D399' }}>'{lightColor}'</span>{'}'}`
);

// and fix `/>` to `></skyra-qr-code>`
content = content.replace(/\{'\/>'\}/g, `></span>{'</'}<span style={{ color: '#FDE047' }}>skyra-qr-code</span>{'>'}`);

fs.writeFileSync(file, content);
