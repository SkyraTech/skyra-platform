const fs = require('fs');

function refactorDateTimeField() {
  const file = 'packages/date-time/src/skyra-tech-date-time-field.ts';
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/'date-value', 'time-value'/g, "'value', 'name'");
  
  // Replace dateValue / timeValue getters with just value
  content = content.replace(/get dateValue\(\) \{[\s\S]*?set value\(v: \{ date: string\|null, time: string \}\) \{[\s\S]*?\}/, 
`get value() { return this.getAttribute('value') || ''; }
  set value(v) { if (v) this.setAttribute('value', v); else this.removeAttribute('value'); }
  get name() { return this.getAttribute('name') || ''; }
  set name(v) { if (v) this.setAttribute('name', v); else this.removeAttribute('name'); }
`);

  content = content.replace(/if \(name === 'date-value' \|\| name === 'time-value'\) \{[\s\S]*?\}\n/, 
`if (name === 'value') {
        if (this._internals && typeof this._internals.setFormValue === 'function') {
          this._internals.setFormValue(newVal);
        }
      }
`);

  // Update listeners
  content = content.replace(/this\._dateField\.addEventListener\('skyra-change', \(e: Event\) => \{[\s\S]*?\}\);/g, 
`this._dateField.addEventListener('skyra-change', (e: Event) => {
      e.stopPropagation();
      const custom = e as CustomEvent;
      const d = custom.detail.value;
      const t = this.value.includes('T') ? this.value.split('T')[1] : '';
      const newVal = d ? (t ? \`\${d}T\${t}\` : d) : '';
      if (newVal !== this.value) {
        this.value = newVal;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));
      }
    });`);
    
  content = content.replace(/this\._timeField\.addEventListener\('skyra-change', \(e: Event\) => \{[\s\S]*?\}\);/g, 
`this._timeField.addEventListener('skyra-change', (e: Event) => {
      e.stopPropagation();
      const custom = e as CustomEvent;
      const t = custom.detail.value;
      const d = this.value.split('T')[0] || '';
      const newVal = d ? (t ? \`\${d}T\${t}\` : d) : '';
      if (newVal !== this.value) {
        this.value = newVal;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));
      }
    });`);

  content = content.replace(/this\._dateField\.setAttribute\('value', this\.dateValue\);\n\s*this\._timeField\.setAttribute\('value', this\.timeValue\);/,
`const parts = this.value.split('T');
    const d = parts[0] || '';
    const t = parts[1] || '';
    if (d) this._dateField.setAttribute('value', d); else this._dateField.removeAttribute('value');
    if (t) this._timeField.setAttribute('value', t); else this._timeField.removeAttribute('value');`);

  content = content.replace(/if \(this\.required && \(\!this\.dateValue \|\| \!this\.timeValue\)\) \{/,
`if (this.required && !this.value) {`);

  // Fix checkValidity
  content = content.replace(/if \(this\.required && \(\!this\.dateValue \|\| \!this\.timeValue\)\) return false;/g, 
    `if (this.required && !this.value) return false;`);

  fs.writeFileSync(file, content);
}

refactorDateTimeField();
