const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', 'utf8');

// The replacement for the Web Component usage snippet
const target = `{'  '}<span style={{ color: '#38BDF8' }}>errorCorrectionLevel</span>={'{'}<span style={{ color: '#34D399' }}>'{errorCorrectionLevel}'</span>{'}'}{'\\n'}
{'  '}<span style={{ color: '#38BDF8' }}>margin</span>={'{'}<span style={{ color: '#FB923C' }}>{margin}</span>{'}'}{'\\n'}
{'  '}<span style={{ color: '#38BDF8' }}>scale</span>={'{'}<span style={{ color: '#FB923C' }}>{scale}</span>{'}'}{'\\n'}
{'  '}<span style={{ color: '#38BDF8' }}>color</span>={'{'}{'{ '}{'\\n'}
{'    '}<span style={{ color: '#38BDF8' }}>dark</span>: <span style={{ color: '#34D399' }}>'{darkColor}'</span>,{'\\n'}
{'    '}<span style={{ color: '#38BDF8' }}>light</span>: <span style={{ color: '#34D399' }}>'{lightColor}'</span>{'\\n'}
{'  '}{'}'}{'}'}{'\\n'}`;

const replacement = `{'  '}<span style={{ color: '#38BDF8' }}>error-correction-level</span>={'{'}<span style={{ color: '#34D399' }}>'{errorCorrectionLevel}'</span>{'}'}{'\\n'}
{'  '}<span style={{ color: '#38BDF8' }}>margin</span>={'{'}<span style={{ color: '#FB923C' }}>{margin}</span>{'}'}{'\\n'}
{'  '}<span style={{ color: '#38BDF8' }}>scale</span>={'{'}<span style={{ color: '#FB923C' }}>{scale}</span>{'}'}{'\\n'}
{'  '}<span style={{ color: '#38BDF8' }}>color-dark</span>=<span style={{ color: '#34D399' }}>"{darkColor}"</span>{'\\n'}
{'  '}<span style={{ color: '#38BDF8' }}>color-light</span>=<span style={{ color: '#34D399' }}>"{lightColor}"</span>{'\\n'}`;

content = content.replace(target, replacement);

fs.writeFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', content);
