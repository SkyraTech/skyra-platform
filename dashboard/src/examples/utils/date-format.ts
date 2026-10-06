/**
 * @id utils-date-format
 * @title Date Formatting
 * @apiId @skyra-tech-platform/utils::formatDate
 * @packageId @skyra-tech-platform/utils
 */
import { formatDate } from '@skyra-tech-platform/utils';

export function runExample() {
  // Runtime-neutral utility function for standardizing dates
  const input = '2026-09-27T10:00:00Z';
  const result = formatDate(input, { format: 'short' });
  console.log(`Formatted: ${result}`);
  return result;
}
