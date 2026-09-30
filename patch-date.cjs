const fs = require('fs');
const path = require('path');

const filesToPatch = [
  'DateRangeField.tsx',
  'MonthField.tsx',
  'YearField.tsx',
  'WeekField.tsx',
  'DateTimeField.tsx',
  'DateTimeRangeField.tsx',
  'TimeRangeField.tsx'
];

for (const comp of filesToPatch) {
  const p = path.join('packages', 'ui', 'src', 'components', comp);
  if (!fs.existsSync(p)) continue;
  
  let txt = fs.readFileSync(p, 'utf8');

  // Skip if already patched
  if (txt.includes('useFloatingPosition')) continue;

  // 1. imports
  txt = txt.replace(
    /import\s+\{([^}]+)\}\s+from\s+'lucide-react';/,
    "import { $1 } from 'lucide-react';\nimport { useFloatingPosition } from '../hooks/useFloatingPosition';"
  );

  // 2. refs & hook
  txt = txt.replace(
    /const containerRef = useRef<HTMLDivElement>\(null\);/,
    `const containerRef = useRef<HTMLDivElement>(null);\n  const popoverRef = useRef<HTMLDivElement>(null);\n  const triggerWrapperRef = useRef<HTMLDivElement>(null);\n\n  const { top, left, actualPlacement } = useFloatingPosition({\n    anchor: triggerWrapperRef,\n    floating: popoverRef,\n    open: isOpen,\n    placement: 'bottom',\n    align: 'start',\n    viewportPadding: 16\n  });`
  );

  // 3. click outside
  txt = txt.replace(
    /useEffect\(\(\) => \{\r?\n\s*const handleClickOutside = \(e: MouseEvent\) => \{\r?\n\s*if \(containerRef\.current && !containerRef\.current\.contains\(e\.target as Node\)\) \{\r?\n\s*setIsOpen\(false\);\r?\n\s*\}\r?\n\s*\};\r?\n\s*document\.addEventListener\('mousedown', handleClickOutside\);\r?\n\s*return \(\) => document\.removeEventListener\('mousedown', handleClickOutside\);\r?\n\s*\}, \[\]\);/,
    `useEffect(() => {\n    const handleClickOutside = (e: MouseEvent | TouchEvent) => {\n      const target = e.target as Node;\n      if (\n        triggerWrapperRef.current?.contains(target) ||\n        popoverRef.current?.contains(target)\n      ) {\n        return;\n      }\n      if (containerRef.current && !containerRef.current.contains(target)) {\n        setIsOpen(false);\n      }\n    };\n    document.addEventListener('mousedown', handleClickOutside);\n    document.addEventListener('touchstart', handleClickOutside);\n    return () => {\n      document.removeEventListener('mousedown', handleClickOutside);\n      document.removeEventListener('touchstart', handleClickOutside);\n    };\n  }, []);`
  );

  // 4. trigger wrapper
  if (comp === 'MonthField.tsx' || comp === 'YearField.tsx' || comp === 'WeekField.tsx' || comp === 'DateTimeRangeField.tsx' || comp === 'TimeRangeField.tsx') {
    // Has `<button type="button" id={fieldId}` as trigger
    txt = txt.replace(
      /(<button\s+type="button"\s+id=\{fieldId\}[^>]*>)/,
      `<div ref={triggerWrapperRef} style={{ width: '100%', position: 'relative' }}>\n      $1`
    );
    // Find the end of this button to close the div
    txt = txt.replace(
      /<\/button>\r?\n\r?\n\s*\{\/\* Popover/g,
      `</button>\n      </div>\n\n      {/* Popover`
    );
  } else if (comp === 'DateRangeField.tsx') {
    txt = txt.replace(
      /\{\/\* Dual Inputs Trigger Container \*\/\}\r?\n\s*<div\r?\n\s*onClick=\{/,
      `{/* Dual Inputs Trigger Container */}\n      <div ref={triggerWrapperRef}\n        onClick={`
    );
  } else if (comp === 'DateTimeField.tsx') {
    txt = txt.replace(
      /\{\/\* Inputs Row \*\/\}\r?\n\s*<div\s+style=\{\{\s*display:\s*'flex',/,
      `{/* Inputs Row */}\n      <div ref={triggerWrapperRef} style={{ display: 'flex',`
    );
  }

  // 5. Popover attributes
  txt = txt.replace(
    /className="skyra-motion-fade-in-up"/g,
    `className={\`skyra-motion-fade-in-up skyra-popover--\${actualPlacement}\`}`
  );
  
  if (comp !== 'DateRangeField.tsx') {
    // Add ref={popoverRef}
    txt = txt.replace(
      /(id=\{popoverId\}|\{isOpen && \(\s*<div\s+className=[^\n]*\n\s*role="dialog")/,
      `id={popoverId}\n          ref={popoverRef}`
    );
  } else {
    txt = txt.replace(
      /role="dialog"/,
      `ref={popoverRef}\n          role="dialog"`
    );
  }

  // Position fixes
  txt = txt.replace(
    /position:\s*'absolute',\r?\n\s*top:\s*'calc\(100% \+ 4px\)',\r?\n\s*left:\s*0,\r?\n\s*zIndex:\s*\d+,/,
    `position: 'fixed',\n            top: \`\${top}px\`,\n            left: \`\${left}px\`,\n            zIndex: 'var(--skyra-z-popover, 1000)',`
  );

  fs.writeFileSync(p, txt, 'utf8');
  console.log('Patched', comp);
}
