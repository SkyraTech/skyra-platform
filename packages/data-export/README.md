# @skyra-tech-platform/data-export

## Overview
Pure CSV and Excel export engine for Skyra Platform.

## Runtime Support
Runtime-neutral (Node.js / Browser)

## Installation
```bash
pnpm add @skyra-tech-platform/data-export
```

## Public API
- `.` (Main export utilities: CSV and Excel generators)

## Basic Usage
```ts
import { exportToCsv } from '@skyra-tech-platform/data-export';

const csvData = exportToCsv([{ name: 'Skyra' }], {
  columns: [{ key: 'name', header: 'Name' }],
});
```

## Dependencies / Peer Dependencies
- **Dependencies:** None
- **Peer Dependencies:** None

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
