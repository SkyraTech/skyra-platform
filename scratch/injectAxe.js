import fs from 'fs';

let content = fs.readFileSync('packages/date-time/src/skyra-tech-date-time.test.ts', 'utf8');

// Add jest-axe imports
content = content.replace(
  `import { describe, it, expect, beforeEach, afterEach } from 'vitest';`,
  `import { describe, it, expect, beforeEach, afterEach } from 'vitest';\nimport { axe, toHaveNoViolations } from 'jest-axe';\nexpect.extend(toHaveNoViolations);`
);

// Add axe test to DateField
content = content.replace(
  `it('participates in forms', () => {`,
  `it('should have no axe violations', async () => {
    const el = document.createElement('skyra-tech-date-field') as SkyraTechDateField;
    el.label = 'Date Field';
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });\n\n  it('participates in forms', () => {`
);

// Add axe test to TimeField
content = content.replace(
  `it('supports checkValidity and reportValidity', () => {`,
  `it('should have no axe violations', async () => {
    const el = document.createElement('skyra-tech-time-field') as SkyraTechTimeField;
    el.label = 'Time Field';
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });\n\n  it('supports checkValidity and reportValidity', () => {`
);

// Add axe test to DateTimeField
const lastBlock = `describe('SkyraTechDateTimeField', () => {`;
const insertPos = content.indexOf(`it('supports checkValidity and reportValidity', () => {`, content.indexOf(lastBlock));
if (insertPos !== -1) {
  content = content.slice(0, insertPos) + `it('should have no axe violations', async () => {
    const el = document.createElement('skyra-tech-date-time-field') as SkyraTechDateTimeField;
    el.label = 'Date Time Field';
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });\n\n  ` + content.slice(insertPos);
}

fs.writeFileSync('packages/date-time/src/skyra-tech-date-time.test.ts', content);
