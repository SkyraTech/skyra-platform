export const css = `
:host {
  display: contents;
}

dialog {
  padding: 0;
  border: none;
  background: var(--skyra-surface);
  color: var(--skyra-text);
  margin: auto;
  box-shadow: var(--skyra-shadow-lg);
  flex-direction: column;
}

dialog[open] {
  display: flex;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

/* Modal styles */
dialog[data-mode="modal"] {
  border-radius: var(--skyra-radius-lg);
  max-width: calc(100vw - 2rem);
  max-height: calc(100dvh - 2rem);
  animation: skyra-dialog-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

dialog[data-mode="modal"][data-size="sm"] { width: 400px; }
dialog[data-mode="modal"][data-size="md"] { width: 560px; }
dialog[data-mode="modal"][data-size="lg"] { width: 720px; }
dialog[data-mode="modal"][data-size="xl"] { width: 900px; }
dialog[data-mode="modal"][data-size="full"] { width: 100%; height: 100%; max-width: none; max-height: none; border-radius: 0; }

@keyframes skyra-dialog-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Drawer styles */
dialog[data-mode="drawer"] {
  position: fixed;
  margin: 0;
  max-width: none;
  max-height: none;
}

dialog[data-mode="drawer"][data-side="right"] {
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  border-radius: var(--skyra-radius-xl) 0 0 var(--skyra-radius-xl);
  width: min(var(--drawer-width, 480px), 100vw);
  animation: skyra-drawer-right 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

dialog[data-mode="drawer"][data-side="left"] {
  top: 0;
  left: 0;
  bottom: 0;
  right: auto;
  border-radius: 0 var(--skyra-radius-xl) var(--skyra-radius-xl) 0;
  width: min(var(--drawer-width, 480px), 100vw);
  animation: skyra-drawer-left 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

dialog[data-mode="drawer"][data-side="bottom"] {
  bottom: 0;
  left: 0;
  right: 0;
  top: auto;
  border-radius: var(--skyra-radius-xl) var(--skyra-radius-xl) 0 0;
  width: 100vw;
  max-height: 90dvh;
  animation: skyra-drawer-bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes skyra-drawer-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes skyra-drawer-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes skyra-drawer-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }

/* Shared layout */
[part="header"] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--skyra-border);
  flex-shrink: 0;
}

[part="title"] {
  font-family: var(--skyra-font-display);
  font-weight: 700;
  font-size: 1.0625rem;
  color: var(--skyra-text);
  margin: 0;
}

[part="close"] {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--skyra-text-muted);
  display: flex;
  padding: 4px;
  border-radius: var(--skyra-radius-sm);
  transition: background-color 0.15s;
}

[part="close"]:hover {
  background-color: var(--skyra-surface-hover);
  color: var(--skyra-text);
}

[part="content"] {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

[part="footer"] {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--skyra-border);
  background: var(--skyra-surface-alt);
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
`;
