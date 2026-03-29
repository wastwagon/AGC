/** RFC-style CSV field escaping for exports */
export function csvEscapeCell(value: string): string {
  const s = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsvRow(cells: string[]): string {
  return `${cells.map(csvEscapeCell).join(",")}\n`;
}
