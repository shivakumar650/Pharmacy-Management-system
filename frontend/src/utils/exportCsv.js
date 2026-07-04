export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) {
    alert("No data to export");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","), // header row
    ...rows.map(row =>
      headers.map(h => `"${row[h] ?? ""}"`).join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
