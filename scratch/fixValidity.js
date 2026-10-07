const fs = require('fs');
const path = require('path');

const files = [
  'skyra-tech-time-range-field.ts',
  'skyra-tech-time-field.ts',
  'skyra-tech-date-time-field.ts',
  'skyra-tech-date-range-field.ts',
  'skyra-tech-date-field.ts'
];

for (const file of files) {
  const p = path.join('packages/date-time/src', file);
  let content = fs.readFileSync(p, 'utf8');
  
  if (!content.includes('checkValidity()')) {
    const methods = `
  public checkValidity() {
    if (this._internals && typeof (this._internals as any).checkValidity === 'function') {
      return (this._internals as any).checkValidity();
    }
    if (this.required && !this.value) return false;
    return true;
  }

  public reportValidity() {
    if (this._internals && typeof (this._internals as any).reportValidity === 'function') {
      return (this._internals as any).reportValidity();
    }
    return this.checkValidity();
  }
`;
    // Insert before the last closing brace.
    const lastBraceIndex = content.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      // Actually we must insert it before the class closes. 
      // The file usually ends with:
      // }
      // 
      // if (typeof customElements !== 'undefined' ...)
      // So let's match the class closing brace.
      const classEndMatch = content.lastIndexOf('\n}');
      content = content.substring(0, classEndMatch) + methods + content.substring(classEndMatch);
      fs.writeFileSync(p, content);
      console.log('Updated ' + file);
    }
  }
}
