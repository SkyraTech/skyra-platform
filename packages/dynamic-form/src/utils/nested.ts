/**
 * Pure nested value manipulation and equality utilities.
 * Handles dot paths ('address.city') and array indexing ('items.0.name').
 */

function parsePath(path: string): string[] {
  return path
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.')
    .filter(Boolean);
}

/**
 * Safely retrieves a nested value by dot/bracket path.
 */
export function getIn(obj: unknown, path: string, defaultValue?: unknown): unknown {
  if (obj == null) return defaultValue;
  if (!path) return obj;

  const parts = parsePath(path);
  let current: unknown = obj;

  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Immutably sets a nested value at dot/bracket path.
 */
export function setIn<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown
): T {
  if (!path) return obj;

  const parts = parsePath(path);
  if (parts.length === 0) return obj;

  function setRecursive(current: unknown, index: number): unknown {
    if (index === parts.length) {
      return value;
    }

    const key = parts[index]!;
    const isNextKeyIndex = !isNaN(Number(parts[index + 1]));

    let target: Record<string, unknown> | unknown[];
    if (current == null || typeof current !== 'object') {
      target = isNextKeyIndex ? [] : {};
    } else if (Array.isArray(current)) {
      target = [...current];
    } else {
      target = { ...(current as Record<string, unknown>) };
    }

    (target as Record<string, unknown>)[key] = setRecursive(
      (target as Record<string, unknown>)[key],
      index + 1
    );

    return target;
  }

  return setRecursive(obj, 0) as T;
}

/**
 * Immutably removes a nested key by path.
 */
export function removeIn<T extends Record<string, unknown>>(obj: T, path: string): T {
  if (!path || obj == null) return obj;

  const parts = parsePath(path);
  if (parts.length === 0) return obj;

  function removeRecursive(current: unknown, index: number): unknown {
    if (current == null || typeof current !== 'object') return current;

    const key = parts[index]!;
    if (index === parts.length - 1) {
      if (Array.isArray(current)) {
        const idx = Number(key);
        if (!isNaN(idx)) {
          const next = [...current];
          next.splice(idx, 1);
          return next;
        }
      }
      const next = { ...(current as Record<string, unknown>) };
      delete next[key];
      return next;
    }

    if (Array.isArray(current)) {
      const idx = Number(key);
      const next = [...current];
      next[idx] = removeRecursive(current[idx], index + 1);
      return next;
    }

    const next = { ...(current as Record<string, unknown>) };
    next[key] = removeRecursive(next[key], index + 1);
    return next;
  }

  return removeRecursive(obj, 0) as T;
}

/**
 * Deep equality check for dirty tracking and pristine comparisons.
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a == null || b == null) {
    // Treat empty string and undefined/null as equivalent in form inputs if unedited
    return a === b;
  }

  if (typeof a !== typeof b) return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!isDeepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

/**
 * Safe deep clone utility
 */
export function cloneDeep<T>(value: T): T {
  if (value == null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as unknown as T;
  }

  const copy: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>)) {
    copy[key] = cloneDeep((value as Record<string, unknown>)[key]);
  }

  return copy as T;
}
