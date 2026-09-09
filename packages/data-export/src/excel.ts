import { ExcelExportOptions, ExcelDownloadOptions, ExportColumn } from './types';

function escapeXml(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Pure XML Spreadsheet 2003 string generator.
 * Produces structured Excel files with formatting, header styles, and typed cells.
 */
export function exportToExcelXml<T = any>(
  data: T[],
  options: ExcelExportOptions<T> = {}
): string {
  const {
    columns: userColumns,
    sheetName = 'Sheet1',
    headers = true,
  } = options;

  let effectiveColumns: ExportColumn<T>[] = [];
  if (userColumns && userColumns.length > 0) {
    effectiveColumns = userColumns;
  } else if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (typeof first === 'object' && first !== null) {
      effectiveColumns = Object.keys(first).map((key) => ({
        key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
      }));
    }
  }

  const safeSheetName = escapeXml(sheetName.substring(0, 31));

  let rowsXml = '';

  // Header row
  if (headers && effectiveColumns.length > 0) {
    let headerCells = '';
    for (const col of effectiveColumns) {
      headerCells += `
        <Cell ss:StyleID="HeaderStyle">
          <Data ss:Type="String">${escapeXml(col.header)}</Data>
        </Cell>`;
    }
    rowsXml += `
      <Row ss:Height="22">
        ${headerCells}
      </Row>`;
  }

  // Data rows
  if (Array.isArray(data)) {
    for (const row of data) {
      let cells = '';
      for (const col of effectiveColumns) {
        const rawValue = (row as any)[col.key];
        const formatted = col.formatter ? col.formatter(rawValue, row) : rawValue;

        if (typeof formatted === 'number') {
          cells += `
            <Cell ss:StyleID="Default">
              <Data ss:Type="Number">${formatted}</Data>
            </Cell>`;
        } else {
          cells += `
            <Cell ss:StyleID="Default">
              <Data ss:Type="String">${escapeXml(formatted)}</Data>
            </Cell>`;
        }
      }
      rowsXml += `
        <Row ss:Height="18">
          ${cells}
        </Row>`;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0F172A"/>
    </Style>
    <Style ss:ID="HeaderStyle">
      <Alignment ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0A58CA"/>
      <Interior ss:Color="#F4F7FC" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${safeSheetName}">
    <Table>
      ${rowsXml}
    </Table>
  </Worksheet>
</Workbook>`;
}

/**
 * Triggers browser download of Excel spreadsheet.
 */
export function downloadExcel<T = any>(
  data: T[],
  options: ExcelDownloadOptions<T> = {}
): void {
  const { filename = 'export.xls', ...exportOptions } = options;
  const xmlContent = exportToExcelXml(data, exportOptions);

  if (typeof window === 'undefined') return;

  const blob = new Blob([xmlContent], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const outName = filename.endsWith('.xls') || filename.endsWith('.xlsx')
    ? filename
    : `${filename}.xls`;
  a.download = outName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const generateExcelXml = exportToExcelXml;
export const exportToExcel = downloadExcel;
