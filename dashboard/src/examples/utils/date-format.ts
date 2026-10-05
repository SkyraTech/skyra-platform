/**
 * @id utils-date-format
 * @title Date Formatting
 * @apiId @skyra/utils::formatDate
 * @packageId @skyra/utils
 */
import { formatDate } from '@skyra/utils';

export function runExample() {
  // Runtime-neutral utility function for standardizing dates
  const input = '2026-09-27T10:00:00Z';
  const result = formatDate(input, { format: 'short' });
  console.log(`Formatted: ${result}`);
  return result;
}
