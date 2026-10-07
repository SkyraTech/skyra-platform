const fs = require('fs');
const file = 'packages/qr/src/skyra-qr-code.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `import { describe, it, expect, beforeEach, afterEach } from 'vitest';`,
  `import { describe, it, expect, beforeEach, afterEach } from 'vitest';\nimport { axe, toHaveNoViolations } from 'jest-axe';\nexpect.extend(toHaveNoViolations);`
);

const axeTest = `
  it('should have no axe violations', async () => {
    const el = document.createElement('skyra-qr-code') as SkyraQRCodeElement;
    el.value = 'Axe test value';
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });
`;

content = content.replace(
  `  it('registers custom element', () => {`,
  `${axeTest}\n  it('registers custom element', () => {`
);

fs.writeFileSync(file, content);
