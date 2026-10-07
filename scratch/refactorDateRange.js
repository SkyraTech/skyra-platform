const fs = require('fs');

function refactorDateRangeField() {
  const file = 'packages/date-time/src/skyra-tech-date-range-field.ts';
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/'start-value', 'end-value'/g, "'value', 'name'");
  
  content = content.replace(/get startValue\(\) \{[\s\S]*?set value\(v: \{ startDate: string\|null, endDate: string\|null \}\) \{[\s\S]*?\}/, 
`get value() { return this.getAttribute('value') || ''; }
  set value(v) { if (v) this.setAttribute('value', v); else this.removeAttribute('value'); }
  get name() { return this.getAttribute('name') || ''; }
  set name(v) { if (v) this.setAttribute('name', v); else this.removeAttribute('name'); }
`);

  content = content.replace(/if \(name === 'start-value' \|\| name === 'end-value'\) \{[\s\S]*?\}\n/, 
`if (name === 'value') {
        if (this._internals && typeof this._internals.setFormValue === 'function') {
          this._internals.setFormValue(newVal);
        }
      }
`);

  content = content.replace(/this\._startField\.addEventListener\('skyra-change', \(e: Event\) => \{[\s\S]*?\}\);/g, 
`this._startField.addEventListener('skyra-change', (e: Event) => {
      e.stopPropagation();
      const custom = e as CustomEvent;
      const s = custom.detail.value;
      const e_val = this.value.includes(',') ? this.value.split(',')[1] : '';
      const newVal = (s || e_val) ? \`\${s},\${e_val}\` : '';
      if (newVal !== this.value) {
        this.value = newVal;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));
      }
    });`);
    
  content = content.replace(/this\._endField\.addEventListener\('skyra-change', \(e: Event\) => \{[\s\S]*?\}\);/g, 
`this._endField.addEventListener('skyra-change', (e: Event) => {
      e.stopPropagation();
      const custom = e as CustomEvent;
      const e_val = custom.detail.value;
      const s = this.value.split(',')[0] || '';
      const newVal = (s || e_val) ? \`\${s},\${e_val}\` : '';
      if (newVal !== this.value) {
        this.value = newVal;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));
      }
    });`);

  content = content.replace(/this\._startField\.setAttribute\('value', this\.startValue\);\n\s*this\._endField\.setAttribute\('value', this\.endValue\);/,
`const parts = this.value.split(',');
    const s = parts[0] || '';
    const e_val = parts[1] || '';
    if (s) this._startField.setAttribute('value', s); else this._startField.removeAttribute('value');
    if (e_val) this._endField.setAttribute('value', e_val); else this._endField.removeAttribute('value');`);

  content = content.replace(/if \(this\.required && \(\!this\.startValue \|\| \!this\.endValue\)\) \{/,
`if (this.required && !this.value) {`);

  content = content.replace(/if \(this\.required && \(\!this\.startValue \|\| \!this\.endValue\)\) return false;/g, 
    `if (this.required && (!this.value || this.value.split(',').length < 2 || !this.value.split(',')[0] || !this.value.split(',')[1])) return false;`);

  fs.writeFileSync(file, content);
}

refactorDateRangeField();
