const fs = require('fs');

let content = fs.readFileSync('packages/date-time/src/skyra-tech-time-field.ts', 'utf8');

content = content.replace(
  `id="hour-pop" role="listbox" tabindex="-1"`,
  `id="hour-pop" role="listbox" aria-label="Select hour" tabindex="-1"`
);

content = content.replace(
  `id="min-pop" role="listbox" tabindex="-1"`,
  `id="min-pop" role="listbox" aria-label="Select minute" tabindex="-1"`
);

content = content.replace(
  /class="option-btn" data-val="\$\{s\}"/g,
  `role="option" class="option-btn" data-val="\${s}"`
);

fs.writeFileSync('packages/date-time/src/skyra-tech-time-field.ts', content);
