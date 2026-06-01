/**
 * Export table data to Excel (.xlsx) using the xlsx library.
 * Loaded dynamically to avoid bloating the main bundle.
 */

interface ExportColumn {
  header: string;
  key: string;
}

export async function exportToExcel(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string = "export"
): Promise<void> {
  const XLSX = await import("xlsx");

  // Build rows with Hebrew headers
  const headers = columns.map((c) => c.header);
  const rows = data.map((row) =>
    columns.map((c) => row[c.key] ?? "")
  );

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set column widths
  if (!ws["!cols"]) ws["!cols"] = [];
  columns.forEach((_, i) => {
    ws["!cols"]![i] = { wch: 18 };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "נתונים");

  // Set workbook to RTL
  wb.Workbook = wb.Workbook || {};
  wb.Workbook.Views = [{ RTL: true }];

  XLSX.writeFile(wb, `${filename}.xlsx`);
}
