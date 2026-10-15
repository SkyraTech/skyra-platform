# @skyra-tech-platform/dynamic-form

Framework-agnostic schema-driven form Web Component. Importing the package registers `skyra-tech-dynamic-form` and loads its component dependencies in the browser.

## Installation

```sh
pnpm add @skyra-tech-platform/dynamic-form
```

## Usage

```js
import '@skyra-tech-platform/dynamic-form';

const form = document.createElement('skyra-tech-dynamic-form');
form.fields = [{ name: 'name', label: 'Name', type: 'text', required: true }];
form.values = { name: 'Skyra' };
form.addEventListener('skyra-submit', event => console.log(event.detail.values));
document.body.append(form);
```

The main entry exports `SkyraTechDynamicForm`, field/form types, nested-value helpers and `evaluateCondition`. It does not export a React `DynamicForm` component. Its manifest declares workspace component, utility and validation dependencies; React, React DOM and lucide-react are not peer requirements.
