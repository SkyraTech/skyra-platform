const fs = require('fs');
const path1 = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/app/(dashboard)/components/forms/dynamic-form/page.tsx';
let content1 = fs.readFileSync(path1, 'utf8');

const target1 = `              <skyra-tech-dynamic-form 
                fields={[
                  { name: 'firstName', label: 'First Name', type: 'text', required: true },
                  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
                  { name: 'email', label: 'Email', type: 'email', required: true }
                ]}
                onSubmit={(data: any) => setBasicResult(data)}
              />
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <skyra-tech-button onClick={() => (document.querySelector('skyra-tech-dynamic-form') as any)?.submit()}>Submit Form</skyra-tech-button>
              </div>`;

const replace1 = `              <skyra-tech-dynamic-form 
                ref={(el: any) => {
                  if (el) {
                    el.fields = [
                      { name: 'firstName', label: 'First Name', type: 'text', required: true },
                      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
                      { name: 'email', label: 'Email', type: 'email', required: true }
                    ];
                    el.addEventListener('skyra-submit', (e: any) => setBasicResult(e.detail.values));
                  }
                }}
              />
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <skyra-tech-button onClick={() => (document.querySelector('skyra-tech-dynamic-form') as any)?.submit()}>Submit Form</skyra-tech-button>
              </div>`;

content1 = content1.replace(/\r\n/g, '\n').replace(target1, replace1).replace(/\n/g, '\r\n');

const target2 = `              <skyra-tech-dynamic-form 
                fields={[
                  { 
                    name: 'role', 
                    label: 'Role', 
                    type: 'select', 
                    options: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]
                  },
                  { 
                    name: 'adminCode', 
                    label: 'Admin Access Code', 
                    type: 'text', 
                    visibleWhen: { field: 'role', operator: 'equals', value: 'admin' }
                  }
                ]}
                onSubmit={(data: any) => alert(JSON.stringify(data))}
              />`;

const replace2 = `              <skyra-tech-dynamic-form 
                ref={(el: any) => {
                  if (el) {
                    el.fields = [
                      { 
                        name: 'role', 
                        label: 'Role', 
                        type: 'select', 
                        options: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]
                      },
                      { 
                        name: 'adminCode', 
                        label: 'Admin Access Code', 
                        type: 'text', 
                        visibleWhen: { field: 'role', operator: 'equals', value: 'admin' }
                      }
                    ];
                    el.addEventListener('skyra-submit', (e: any) => alert(JSON.stringify(e.detail.values)));
                  }
                }}
              />`;

content1 = content1.replace(target2.replace(/\r\n/g, '\n'), replace2).replace(/\n/g, '\r\n');
fs.writeFileSync(path1, content1);

const path2 = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/examples/dynamic-form/dynamic-form-basic.tsx';
let content2 = fs.readFileSync(path2, 'utf8');
const target3 = `      <skyra-tech-dynamic-form 
        fields={fields}
        onSubmit={(data: any) => alert(JSON.stringify(data, null, 2))}
      />`;
const replace3 = `      <skyra-tech-dynamic-form 
        ref={(el: any) => {
          if (el) {
            el.fields = fields;
            el.addEventListener('skyra-submit', (e: any) => alert(JSON.stringify(e.detail.values, null, 2)));
          }
        }}
      />`;
content2 = content2.replace(/\r\n/g, '\n').replace(target3, replace3).replace(/\n/g, '\r\n');
fs.writeFileSync(path2, content2);
console.log("Done");
