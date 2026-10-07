const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/responsive-sandbox/page.tsx', 'utf8');

content = content.replace(/el\.fields = /g, `(el as any).fields = `);
content = content.replace(/form\.fields = /g, `(form as any).fields = `);
content = content.replace(/form\.fieldsets = /g, `(form as any).fieldsets = `);
content = content.replace(/el\.fieldsets = /g, `(el as any).fieldsets = `);
content = content.replace(/form\.features = /g, `(form as any).features = `);
content = content.replace(/el\.features = /g, `(el as any).features = `);

fs.writeFileSync('dashboard/src/app/responsive-sandbox/page.tsx', content);
