const fs = require('fs');
const path = require('path');

const comp = 'DateRangeField.tsx';
const p = path.join('packages', 'ui', 'src', 'components', comp);
let txt = fs.readFileSync(p, 'utf8');

if (!txt.includes('useFloatingPosition')) {
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

  txt = txt.replace(
    /\{\/\* Dual Inputs Trigger Container \*\/\}\r?\n\s*<div\r?\n\s*onClick=\{/,
    `{/* Dual Inputs Trigger Container */}\n      <div ref={triggerWrapperRef}\n        onClick={`
  );

  txt = txt.replace(
    /className="skyra-motion-fade-in-up"/g,
    `className={\`skyra-motion-fade-in-up skyra-popover--\${actualPlacement}\`}`
  );
  
  txt = txt.replace(
    /role="dialog"/,
    `ref={popoverRef}\n          role="dialog"`
  );

  txt = txt.replace(
    /position:\s*'absolute',\r?\n\s*top:\s*'calc\(100% \+ 4px\)',\r?\n\s*left:\s*0,\r?\n\s*zIndex:\s*\d+,/,
    `position: 'fixed',\n            top: \`\${top}px\`,\n            left: \`\${left}px\`,\n            zIndex: 'var(--skyra-z-popover, 1000)',`
  );

  fs.writeFileSync(p, txt, 'utf8');
  console.log('Patched DateRangeField.tsx');
}
