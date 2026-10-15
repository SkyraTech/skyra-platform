# @skyra-tech-platform/app-shell

Framework-agnostic application shell Web Component. Registration is explicit.

## Installation

```sh
pnpm add @skyra-tech-platform/app-shell
```

## Usage

```js
import { registerAppShell } from '@skyra-tech-platform/app-shell';
import '@skyra-tech-platform/app-shell/styles.css';

registerAppShell();
const shell = document.createElement('skyra-tech-app-shell');
shell.innerHTML = '<nav slot="sidebar">Navigation</nav><header slot="header">Skyra</header><main>Content</main>';
document.body.append(shell);
```

The main entry exports `SkyraAppShell` and `registerAppShell`. It does not export React `ApplicationShell`, `Sidebar`, or `Header` components. The CSS subpath is `@skyra-tech-platform/app-shell/styles.css`.
