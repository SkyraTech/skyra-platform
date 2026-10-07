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
  
  // Find the exact block we inserted at the end
  const badBlockRegex = /\s*public checkValidity\(\) \{[\s\S]*?\}\s*public reportValidity\(\) \{[\s\S]*?\}\s*\}/;
  
  if (badBlockRegex.test(content)) {
    // Remove the bad block from the end
    content = content.replace(badBlockRegex, '');
    
    // Now insert it correctly at the end of the class. The class closing brace is before `if (typeof customElements !== 'undefined'`
    const classEndRegex = /\}\s*if \(typeof customElements !== 'undefined'/;
    
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
}
if (typeof customElements !== 'undefined'`;

    content = content.replace(classEndRegex, methods);
    fs.writeFileSync(p, content);
    console.log('Fixed ' + file);
  } else {
    console.log('No bad block found in ' + file);
  }
}
