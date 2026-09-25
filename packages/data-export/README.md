# @skyra/data-export

## Overview
Pure CSV and Excel export engine for Skyra Platform.

## Runtime Support
Runtime-neutral (Node.js / Browser)

## Installation
```bash
pnpm add @skyra/data-export
```

## Public API
- `.` (Main export utilities: CSV and Excel generators)

## Basic Usage
```ts
import { generateCsv } from '@skyra/data-export';

const csvData = generateCsv(data, columns);
```

## Dependencies / Peer Dependencies
- **Dependencies:** None
- **Peer Dependencies:** None

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
