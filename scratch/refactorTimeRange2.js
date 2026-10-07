const fs = require('fs');
let file = 'packages/date-time/src/skyra-tech-time-range-field.ts';
let content = fs.readFileSync(file, 'utf8');

// replace observedAttributes
content = content.replace("'start-value', 'end-value',", "'value', 'name',");

// replace attributeChangedCallback
content = content.replace(/if \(name === 'start-value' \|\| name === 'end-value'\) \{[\s\S]*?\}\n/,
`if (name === 'value') {
        if (this._internals && typeof this._internals.setFormValue === 'function') {
          this._internals.setFormValue(newVal);
        }
      }
`);

// update listeners
content = content.replace(/this\._startField\.addEventListener\('skyra-change', \(e: Event\) => \{[\s\S]*?\}\);/,
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
    
content = content.replace(/this\._endField\.addEventListener\('skyra-change', \(e: Event\) => \{[\s\S]*?\}\);/,
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

// insert value getters, setters, and name setter
content = content.replace(/get startValue\(\) \{ return this\.getAttribute\('start-value'\) \|\| ''; \}/,
`get value() { return this.getAttribute('value') || ''; }
  set value(v) { if (v) this.setAttribute('value', v); else this.removeAttribute('value'); }
  get startValue() { return this.value.split(',')[0] || ''; }`);
  
content = content.replace(/set startValue\(v\) \{[\s\S]*?\}\n/, "");
content = content.replace(/get endValue\(\) \{ return this\.getAttribute\('end-value'\) \|\| ''; \}/,
`get endValue() { return this.value.split(',')[1] || ''; }`);
content = content.replace(/set endValue\(v\) \{[\s\S]*?\}\n/, "");

// insert name setter
content = content.replace(/get disabled\(\) \{/, 
`get name() { return this.getAttribute('name') || ''; }
  set name(v) { if (v) this.setAttribute('name', v); else this.removeAttribute('name'); }
  get disabled() {`);

// fix checkValidity
content = content.replace(/if \(this\.required && \(\!this\.startValue \|\| \!this\.endValue\)\) \{/, `if (this.required && !this.value) {`);
content = content.replace(/if \(this\.required && \(\!this\.startValue \|\| \!this\.endValue\)\) return false;/, `if (this.required && (!this.value || this.value.split(',').length < 2 || !this.value.split(',')[0] || !this.value.split(',')[1])) return false;`);

fs.writeFileSync(file, content);
