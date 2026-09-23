import { FieldCondition, ConditionPredicate, ConditionOperator } from '../types';
import { getIn } from './nested';

/**
 * Pure evaluator for field conditional visibility.
 */
export function evaluateCondition<TValues extends Record<string, unknown>>(
  condition: FieldCondition<TValues> | ConditionPredicate<TValues> | undefined,
  values: TValues
): boolean {
  if (!condition) return true;

  // 1. Predicate function
  if (typeof condition === 'function') {
    try {
      return Boolean(condition(values));
    } catch {
      return false;
    }
  }

  // 2. Compound conditions (AND / OR)
  if (condition.and && Array.isArray(condition.and)) {
    return condition.and.every((c) => evaluateCondition(c, values));
  }
  if (condition.or && Array.isArray(condition.or)) {
    return condition.or.some((c) => evaluateCondition(c, values));
  }

  // 3. Declarative condition object
  const { field } = condition;
  if (!field) return true;

  const fieldValue = getIn(values, field);

  // Check explicit property-based operators
  if (condition.equals !== undefined) {
    return fieldValue === condition.equals;
  }
  if (condition.notEquals !== undefined) {
    return fieldValue !== condition.notEquals;
  }
  if (condition.contains !== undefined) {
    return checkContains(fieldValue, condition.contains);
  }
  if (condition.notContains !== undefined) {
    return !checkContains(fieldValue, condition.notContains);
  }
  if (condition.isEmpty !== undefined) {
    return condition.isEmpty ? checkIsEmpty(fieldValue) : !checkIsEmpty(fieldValue);
  }
  if (condition.isNotEmpty !== undefined) {
    return condition.isNotEmpty ? !checkIsEmpty(fieldValue) : checkIsEmpty(fieldValue);
  }
  if (condition.greaterThan !== undefined) {
    return Number(fieldValue) > Number(condition.greaterThan);
  }
  if (condition.lessThan !== undefined) {
    return Number(fieldValue) < Number(condition.lessThan);
  }
  if (condition.in !== undefined) {
    return Array.isArray(condition.in) && condition.in.includes(fieldValue);
  }
  if (condition.notIn !== undefined) {
    return Array.isArray(condition.notIn) && !condition.notIn.includes(fieldValue);
  }

  // Check operator string format if provided
  const op: ConditionOperator = condition.operator ?? 'equals';
  const target = condition.value;

  switch (op) {
    case 'equals':
      return fieldValue === target;
    case 'notEquals':
      return fieldValue !== target;
    case 'contains':
      return checkContains(fieldValue, target);
    case 'notContains':
      return !checkContains(fieldValue, target);
    case 'isEmpty':
      return checkIsEmpty(fieldValue);
    case 'isNotEmpty':
      return !checkIsEmpty(fieldValue);
    case 'greaterThan':
      return Number(fieldValue) > Number(target);
    case 'lessThan':
      return Number(fieldValue) < Number(target);
    case 'in':
      return Array.isArray(target) && target.includes(fieldValue);
    case 'notIn':
      return Array.isArray(target) && !target.includes(fieldValue);
    default:
      return fieldValue === target;
  }
}

function checkContains(value: unknown, target: unknown): boolean {
  if (value == null || target == null) return false;

  if (Array.isArray(value)) {
    return value.includes(target);
  }

  return String(value)
    .toLowerCase()
    .includes(String(target).toLowerCase());
}

function checkIsEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
}
