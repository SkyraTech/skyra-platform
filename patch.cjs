const fs = require('fs');
const path = require('path');

const p = path.join('packages', 'ui', 'src', 'components', 'DateRangeField.tsx');
let txt = fs.readFileSync(p, 'utf8');

txt = txt.replace(
  'import { Calendar',
  'import { useFloatingPosition } from \'../hooks/useFloatingPosition\';\nimport { Calendar'
);

txt = txt.replace(
  'const containerRef = useRef<HTMLDivElement>(null);',
  'const containerRef = useRef<HTMLDivElement>(null);\n  const popoverRef = useRef<HTMLDivElement>(null);\n  const triggerWrapperRef = useRef<HTMLDivElement>(null);\n  const { top, left, actualPlacement } = useFloatingPosition({ anchor: triggerWrapperRef, floating: popoverRef, open: isOpen, placement: \'bottom\', align: \'start\', viewportPadding: 16 });'
);

txt = txt.replace(
  'if (containerRef.current && !containerRef.current.contains(e.target as Node))',
  'const target = e.target as Node;\n      if (triggerWrapperRef.current?.contains(target) || popoverRef.current?.contains(target)) return;\n      if (containerRef.current && !containerRef.current.contains(target))'
);

txt = txt.replace(
  '{/* Dual Inputs Trigger Container */}\n      <div\n        onClick={',
  '{/* Dual Inputs Trigger Container */}\n      <div ref={triggerWrapperRef}\n        onClick={'
);

txt = txt.replace(
  /position:\s*'absolute',\r?\n\s*top:\s*'calc\(100% \+ 4px\)',\r?\n\s*left:\s*0,\r?\n\s*zIndex:\s*250,/,
  'position: \'fixed\', top: `${top}px`, left: `${left}px`, zIndex: \'var(--skyra-z-popover, 1000)\','
);

txt = txt.replace(
  /className="skyra-motion-fade-in-up"/,
  'className={`skyra-motion-fade-in-up skyra-popover--${actualPlacement}`}'
);

txt = txt.replace(
  /role="dialog"/,
  'ref={popoverRef} role="dialog"'
);

fs.writeFileSync(p, txt, 'utf8');
console.log('Done');
