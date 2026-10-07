const fs = require('fs');
let c = fs.readFileSync('dashboard/src/components/ui/CheckboxGroup.tsx', 'utf8');

c = c.replace(/<skyra-tech-checkbox[\s\S]*?onChange=\{\(e\) => handleToggle\(opt\.value, e\.target\.checked\)\}[\s\S]*?\/>/, `<skyra-tech-checkbox
              key={opt.value}
              value={opt.value}
              checked={isChecked}
              disabled={isOptionDisabled}
              onChange={(e) => handleToggle(opt.value, e.target.checked)}
            >
              <div slot="label" style={{ display: 'contents' }}>{opt.label}</div>
              {opt.description && <div slot="helper" style={{ display: 'contents' }}>{opt.description}</div>}
            </skyra-tech-checkbox>`);

fs.writeFileSync('dashboard/src/components/ui/CheckboxGroup.tsx', c);
