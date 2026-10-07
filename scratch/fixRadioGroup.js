const fs = require('fs');

function replaceFile(path, regex, repl) {
  let c = fs.readFileSync(path, 'utf8');
  c = c.replace(regex, repl);
  fs.writeFileSync(path, c);
}

replaceFile('dashboard/src/components/ui/RadioGroup.tsx', /<skyra-tech-radio[\s\S]*?onChange=\{\(\) => onChange\(opt\.value\)\}[\s\S]*?\/>/, `<skyra-tech-radio
              key={opt.value}
              name={groupName}
              value={opt.value}
              checked={isChecked}
              disabled={isOptionDisabled}
              onChange={() => onChange(opt.value)}
            >
              <div slot="label" style={{ display: 'contents' }}>{opt.label}</div>
              {opt.description && <div slot="helper" style={{ display: 'contents' }}>{opt.description}</div>}
            </skyra-tech-radio>`);
