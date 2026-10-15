# @skyra-tech-platform/toast

Framework-agnostic toast viewport and imperative toast API. Importing the package registers `skyra-tech-toast-viewport`, the compatible `skyra-toast-viewport` tag, and Notification elements.

## Installation

```sh
pnpm add @skyra-tech-platform/toast
```

## Usage

Call the API in a browser after the document body exists:

```js
import { toast } from '@skyra-tech-platform/toast';

toast({ title: 'Saved', message: 'Your changes were saved.', type: 'success' });
```

The main entry exports `toast`, `SkyraToastViewportElement` and `ToastOptions`. The API creates its viewport when needed. Component styles are embedded; no Button import is required by this usage.
