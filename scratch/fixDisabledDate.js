const fs = require('fs');

let dTsContent = fs.readFileSync('dashboard/src/custom-elements.d.ts', 'utf8');

if (!dTsContent.includes('interface SkyraTechDateFieldElement')) {
  dTsContent = dTsContent.replace(
    /interface SkyraTechDynamicFormElement extends HTMLElement \{/,
    `interface SkyraTechDateFieldElement extends HTMLElement {
    disabledDate?: (date: Date) => boolean;
  }
  
  interface SkyraTechCalendarElement extends HTMLElement {
    disabledDate?: (date: Date) => boolean;
  }
  
  interface SkyraTechDynamicFormElement extends HTMLElement {`
  );
  fs.writeFileSync('dashboard/src/custom-elements.d.ts', dTsContent);
}

let dateFieldContent = fs.readFileSync('dashboard/src/components/ui/DateField.tsx', 'utf8');
dateFieldContent = dateFieldContent.replace(/\(el as any\)\.disabledDate/g, `(el as SkyraTechDateFieldElement).disabledDate`);
fs.writeFileSync('dashboard/src/components/ui/DateField.tsx', dateFieldContent);

let calendarContent = fs.readFileSync('dashboard/src/components/ui/Calendar.tsx', 'utf8');
calendarContent = calendarContent.replace(/\(el as any\)\.disabledDate/g, `(el as SkyraTechCalendarElement).disabledDate`);
fs.writeFileSync('dashboard/src/components/ui/Calendar.tsx', calendarContent);
