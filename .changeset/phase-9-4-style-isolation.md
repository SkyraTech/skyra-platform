---
"@skyra/ui": patch
---

fix: Scope reduced-motion accessibility styles to explicitly target Skyra components

Previously, the `@media (prefers-reduced-motion: reduce)` block applied a global wildcard (`*`) selector, which unintentionally neutralized animations and transitions across the entire consumer application DOM. The rule has been scoped down to target only elements carrying the `skyra-` class prefix, ensuring that the user's accessibility preference is respected within the Platform UI without mutating unrelated third-party or application-owned DOM elements.
