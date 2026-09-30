const fs = require('fs');
const path = require('path');

const componentsToPatch = ['DateField.tsx', 'DateRangeField.tsx', 'DateTimeField.tsx', 'DateTimeRangeField.tsx', 'TimeRangeField.tsx', 'MonthField.tsx', 'YearField.tsx', 'WeekField.tsx'];

for (const comp of componentsToPatch) {
  const p = path.join('packages', 'ui', 'src', 'components', comp);
  if (!fs.existsSync(p)) continue;

  let content = fs.readFileSync(p, 'utf8');

  // Skip if already patched
  if (content.includes('useFloatingPosition')) continue;

  // 1. imports
  content = content.replace(
    /import\s+\{([^}]*)\}\s+from\s+'lucide-react';/,
    "import { $1 } from 'lucide-react';\nimport { useFloatingPosition } from '../hooks/useFloatingPosition';"
  );

  // 2. refs & hook
  content = content.replace(
    /const containerRef = useRef<HTMLDivElement>\(null\);\r?\n\s*const popoverRef = useRef<HTMLDivElement>\(null\);/,
    `const containerRef = useRef<HTMLDivElement>(null);\n  const popoverRef = useRef<HTMLDivElement>(null);\n  const triggerWrapperRef = useRef<HTMLDivElement>(null);\n\n  const { top, left, actualPlacement } = useFloatingPosition({\n    anchor: triggerWrapperRef,\n    floating: popoverRef,\n    open: isOpen,\n    placement: 'bottom',\n    align: 'start',\n    viewportPadding: 16\n  });`
  );

  // 3. click outside
  content = content.replace(
    /useEffect\(\(\) => \{\r?\n\s*const handleClickOutside = \(e: MouseEvent\) => \{\r?\n\s*if \(containerRef\.current && !containerRef\.current\.contains\(e\.target as Node\)\) \{\r?\n\s*setIsOpen\(false\);\r?\n\s*\}\r?\n\s*\};\r?\n\s*document\.addEventListener\('mousedown', handleClickOutside\);\r?\n\s*return \(\) => document\.removeEventListener\('mousedown', handleClickOutside\);\r?\n\s*\}, \[\]\);/,
    `useEffect(() => {\n    const handleClickOutside = (e: MouseEvent | TouchEvent) => {\n      const target = e.target as Node;\n      if (\n        triggerWrapperRef.current?.contains(target) ||\n        popoverRef.current?.contains(target)\n      ) {\n        return;\n      }\n      setIsOpen(false);\n    };\n    document.addEventListener('mousedown', handleClickOutside);\n    document.addEventListener('touchstart', handleClickOutside);\n    return () => {\n      document.removeEventListener('mousedown', handleClickOutside);\n      document.removeEventListener('touchstart', handleClickOutside);\n    };\n  }, []);`
  );

  // 4. triggerWrapperRef - For DateField, MonthField, YearField, WeekField, TimeRangeField, DateTimeField
  content = content.replace(
    /\{\/\*\s*(Input row|Dual Inputs Trigger Container|Inputs Row|Input Trigger)\s*\*\/\}\r?\n\s*<div\s+(?:onClick=\{[^\}]+\}\s+)?style=\{\{\s*position:\s*'relative',/i,
    `{/* Trigger Wrapper */}\n      <div ref={triggerWrapperRef} style={{ position: 'relative',`
  );
  // Alternative for DateRangeField (has flex but not relative)
  if (comp === 'DateRangeField.tsx' || comp === 'DateTimeRangeField.tsx' || comp === 'TimeRangeField.tsx') {
    content = content.replace(
      /(<div\s+onClick=\{[^\}]+\}\s+style=\{\{[\s\S]*?display:\s*'flex',[\s\S]*?\}\})/,
      `<div ref={triggerWrapperRef} $1`
    );
    // Remove duplicate ref if added
    content = content.replace(/<div ref=\{triggerWrapperRef\} <div ref=\{triggerWrapperRef\}/, '<div ref={triggerWrapperRef}');
  }

  // Fallback for TimeRangeField button trigger
  if (comp === 'TimeRangeField.tsx') {
    content = content.replace(
      /(<button[^>]*?type="button"[^>]*?id=\{fieldId\}[^>]*?>)/,
      `<div ref={triggerWrapperRef} style={{width: '100%'}}>\n      $1`
    );
    // find where the button ends and close the div
    content = content.replace(
      /<\/button>\r?\n\r?\n\s*\{\/\* Popover \*\/\}/,
      `</button>\n      </div>\n\n        {/* Popover */}`
    );
  }

  // 5. Popover fixed position
  content = content.replace(
    /(<div[\s\S]*?id=\{popoverId\}[\s\S]*?style=\{\{)([\s\S]*?)position:\s*'absolute',/,
    `$1\n            position: 'fixed',\n            top: \`\${top}px\`,\n            left: \`\${left}px\`,\n            zIndex: 'var(--skyra-z-popover, 1000)',`
  );
  
  // Clean up old position values if they were below
  content = content.replace(/top:\s*'calc\(100% \+ 4px\)',\r?\n\s*left:\s*0,\r?\n\s*zIndex:\s*2\d+,\r?\n/, '');

  // Update Popover animation direction
  content = content.replace(
    /className="skyra-motion-fade-in-up"/,
    `className={\`skyra-motion-fade-in-up skyra-popover--\${actualPlacement}\`}`
  );

  fs.writeFileSync(p, content, 'utf8');
  console.log(`${comp} updated.`);
}
