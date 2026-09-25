# @skyra/validation

## Overview
Skyra Platform authoritative Zod validation schemas — zero DOM/React/CSS dependencies. Used for validating common platform data shapes.

## Runtime Support
Runtime-neutral (Node.js / Browser)

## Installation
```bash
pnpm add @skyra/validation
```

## Public API
- `.` (Exported Zod schemas and validation helpers)

## Basic Usage
```ts
import { emailSchema } from '@skyra/validation';

const result = emailSchema.safeParse('test@skyra.tech');
```

## Dependencies / Peer Dependencies
- **Dependencies:** None
- **Peer Dependencies:** `zod`

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
