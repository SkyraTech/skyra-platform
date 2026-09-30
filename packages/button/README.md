# @skyra-tech-platform/button

Framework-independent button component for the Skyra Tech Platform, implemented as a native Web Component (`<skyra-tech-button>`).

## Features
- **Variants:** `primary`, `orange`, `outline`, `ghost`, `danger`, `destructive`, `link`
- **Sizes:** `sm`, `md`, `lg`
- **States:** `loading`, `disabled`
- **Options:** `full-width`, `icon-only`
- **Slots:** `left-icon`, `right-icon`, default text slot
- Fully accessible (ARIA roles, attributes, keyboard support)

## Usage

### Vanilla HTML / No Framework

```html
<script type="module">
  import '@skyra-tech-platform/button';
</script>

<skyra-tech-button variant="primary" size="md">
  Save Changes
</skyra-tech-button>
```

### React / Next.js

Since React 19 natively supports Custom Elements (and Next.js App Router works well with them), you can simply use the custom element after importing it (which automatically registers the component).

```tsx
'use client';
import '@skyra-tech-platform/button';

export function MyComponent() {
  return (
    <skyra-tech-button variant="orange" onClick={() => console.log('clicked')}>
      React Button
    </skyra-tech-button>
  );
}
```

### Angular, Vue, Svelte
The component works natively in all standard web frameworks since it is a standard `HTMLElement`.
