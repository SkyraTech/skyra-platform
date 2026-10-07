const fs = require('fs');
const path = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/app/responsive-sandbox/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `      <skyra-tech-dynamic-form 
        fieldsets={[
          {
            title: 'Responsive Grid Form',
            fields: [
              { key: 'f1', label: 'First Name', type: 'text' },
              { key: 'f2', label: 'Last Name', type: 'text' },
              { key: 'f3', label: 'Email', type: 'email' },
            ]
          }
        ]}
        values={{}}
        errors={{}}
        onChange={() => {}}
        onSubmit={() => {}}
      />`;

const replace = `      <skyra-tech-dynamic-form 
        ref={(el: any) => {
          if (el) {
            el.fieldsets = [
              {
                title: 'Responsive Grid Form',
                fields: [
                  { name: 'f1', label: 'First Name', type: 'text' },
                  { name: 'f2', label: 'Last Name', type: 'text' },
                  { name: 'f3', label: 'Email', type: 'email' },
                ]
              }
            ];
          }
        }}
      />`;

content = content.replace(/\r\n/g, '\n').replace(target, replace).replace(/\n/g, '\r\n');
fs.writeFileSync(path, content);
console.log("Done");
