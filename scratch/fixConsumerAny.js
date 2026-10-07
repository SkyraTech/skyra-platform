const fs = require('fs');
const basicPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/examples/dynamic-form/dynamic-form-basic.tsx';
let basic = fs.readFileSync(basicPath, 'utf8');
basic = basic.replace(/ref=\{\(el: any\) => \{/g, 'ref={(el: HTMLElement | null) => {');
basic = basic.replace(/el\.addEventListener\('skyra-submit', \(e: any\) =>/g, 'el.addEventListener("skyra-submit", (e: Event) =>');
basic = basic.replace(/e\.detail\.values/g, '(e as CustomEvent).detail.values');
fs.writeFileSync(basicPath, basic);

const pagePath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/app/(dashboard)/components/forms/dynamic-form/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');
page = page.replace(/as any\)\?\.submit\(\)/g, 'as HTMLElement & { submit: () => void })?.submit()');
page = page.replace(/ref=\{\(el: any\) => \{/g, 'ref={(el: HTMLElement | null) => {');
page = page.replace(/el\.addEventListener\('skyra-submit', \(e: any\) =>/g, 'el.addEventListener("skyra-submit", (e: Event) =>');
page = page.replace(/e\.detail/g, '(e as CustomEvent).detail');
fs.writeFileSync(pagePath, page);

const sandboxPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/app/responsive-sandbox/page.tsx';
let sandbox = fs.readFileSync(sandboxPath, 'utf8');
sandbox = sandbox.replace(/ref=\{\(el: any\) => \{/g, 'ref={(el: HTMLElement | null) => {');
fs.writeFileSync(sandboxPath, sandbox);

console.log('Fixed consumers');
