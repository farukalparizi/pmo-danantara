import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export function exportToPDF(projects, formatCurrency, formatDate) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Laporan Portofolio Proyek Strategis (PMO)", 14, 15);
  doc.setFontSize(10);
  doc.text(`Tanggal Export: ${formatDate(new Date().toISOString().slice(0, 10))}`, 14, 22);

  const tableColumn = ["Kode", "Nama Proyek", "Perusahaan", "Mulai", "Selesai", "Anggaran (M)", "Status"];
  const tableRows = [];

  projects.forEach(p => {
    const row = [
      p.code,
      p.name,
      p.co,
      formatDate(p.start),
      formatDate(p.end),
      formatCurrency(p.bud),
      p.st
    ];
    tableRows.push(row);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [13, 31, 60] }
  });

  doc.save("Laporan_PMO_Danantara.pdf");
}

export function exportToExcel(projects, formatCurrency, formatDate) {
  const worksheetData = projects.map(p => ({
    "Kode Proyek": p.code,
    "Nama Proyek": p.name,
    "Perusahaan": p.co,
    "Tanggal Mulai": formatDate(p.start),
    "Tanggal Selesai": formatDate(p.end),
    "Anggaran (Miliar Rp)": formatCurrency(p.bud),
    "Status": p.st
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Proyek");

  XLSX.writeFile(workbook, "Laporan_PMO_Danantara.xlsx");
}
