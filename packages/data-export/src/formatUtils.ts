export function formatDate(value: any, dateFormat?: string): any {
  if (!dateFormat) return value;
  let d: Date | null = null;
  if (value instanceof Date) {
    d = value;
  } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?$/.test(value)) {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) d = parsed;
  }

  if (!d) return value;

  const YYYY = d.getFullYear().toString();
  const MM = (d.getMonth() + 1).toString().padStart(2, '0');
  const DD = d.getDate().toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');

  let formatted = dateFormat
    .replace('YYYY', YYYY)
    .replace('MM', MM)
    .replace('DD', DD)
    .replace('hh', hh)
    .replace('mm', mm)
    .replace('ss', ss);
  return formatted;
}
