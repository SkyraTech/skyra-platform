# @skyra/dynamic-form

## Overview
Skyra Platform schema-driven DynamicForm — mobile-first 2-col/1-col layout with robust Zod validation binding.

## Runtime Support
React + Browser

## Installation
```bash
pnpm add @skyra/dynamic-form
```

## Public API
- `.` (Main React component: `DynamicForm`, and types)

## Basic Usage
```tsx
import { DynamicForm } from '@skyra/dynamic-form';
import { z } from 'zod';

const schema = z.object({ name: z.string() });

export function ProfileForm() {
  return (
    <DynamicForm 
      config={formConfig}
      initialValues={{ name: '' }}
      onSubmit={console.log}
    />
  );
}
```

## Dependencies / Peer Dependencies
- **Dependencies:** `@skyra/ui`, `@skyra/utils`, `@skyra/validation`
- **Peer Dependencies:** `react`, `react-dom`, `lucide-react`

## Responsive Behavior
Relies on CSS Grid to automatically adapt from a 2-column desktop layout to a 1-column mobile layout.

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
