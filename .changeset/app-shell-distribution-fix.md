---
"@skyra/app-shell": patch
---

fix(app-shell): migrate distribution architecture to tsup

- Migrated package build system from raw `tsc` to `tsup` to match the Platform's standard distribution architecture.
- Remapped public `exports`, `main`, `module`, and `types` to target the compiled `./dist` artifacts instead of raw `./src` TypeScript files.
- Resolved missing local `@types/react` dependencies that caused isolated build failures.
- Packages are now properly isolated, independently consumable, and fully resolvable without requiring consumers to transpile workspace source.
