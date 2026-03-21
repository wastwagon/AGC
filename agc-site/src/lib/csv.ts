/**
 * CSV helpers - escape cells to prevent formula injection (Excel/Sheets)
 */
const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

/** Escape a cell value for CSV - quotes + formula-safe */
export function escapeCsvCell(value: string | number | null | undefined): string {
  const str = String(value ?? "").replace(/"/g, '""');
  const first = str.charAt(0);
  if (FORMULA_PREFIXES.includes(first)) {
    return `"'\t${str}"`;
  }
  return `"${str}"`;
}
