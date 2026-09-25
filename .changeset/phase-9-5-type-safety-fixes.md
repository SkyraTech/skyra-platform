---
"@skyra/ui": patch
"@skyra/dynamic-form": patch
---

fix: Strengthen internal and public type safety across Platform components

Hardened multiple components by removing unnecessary `any` types and `as any` assertions. Replaced generic data boundaries in `ExportButton` and `ExportMenu` with proper generic type variables. Replaced weak implicit object casting in dynamic forms with narrowed type models, and hardened ref propagation logic to properly extend React component mutable refs.
