const ExcelJS = require('exceljs');

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-CO') : 'Sin filtro';

/**
 * Genera un archivo Excel (.xlsx) con las estadísticas de FourPark.
 * Retorna un Buffer.
 */
exports.generateStatsExcel = async (data, filters = {}) => {
  const { getGeneralStatics: gs, countEarningByDays: days, countReservationByHour: hours } = data;

  const wb = new ExcelJS.Workbook();
  wb.creator    = 'FourPark API';
  wb.created    = new Date();
  wb.properties.date1904 = false;

  // ── Estilos reutilizables ─────────────────────────────────────────────────
  const headerFill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A73E8' } };
  const headerFont  = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  const accentFont  = { bold: true, color: { argb: 'FF1A73E8' }, size: 12 };
  const grayFont    = { color: { argb: 'FF757575' }, size: 9 };
  const border = {
    top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
    left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
    bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
    right: { style: 'thin', color: { argb: 'FFDDDDDD' } },
  };

  const addHeader = (ws, cols) => {
    const row = ws.addRow(cols);
    row.eachCell(cell => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.border = border;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    row.height = 22;
    return row;
  };

  // ── Hoja 1: Resumen General ───────────────────────────────────────────────
  const ws1 = wb.addWorksheet('Resumen General');
  ws1.columns = [
    { key: 'metric', width: 30 },
    { key: 'value',  width: 25 },
  ];

  // Título
  ws1.mergeCells('A1:B1');
  const titleCell = ws1.getCell('A1');
  titleCell.value     = 'FourPark — Reporte de Estadísticas';
  titleCell.font      = { bold: true, size: 14, color: { argb: 'FF1A73E8' } };
  titleCell.alignment = { horizontal: 'center' };
  ws1.getRow(1).height = 30;

  ws1.mergeCells('A2:B2');
  ws1.getCell('A2').value = `Período: ${fmtDate(filters.startDate)} — ${fmtDate(filters.endDate)}`;
  ws1.getCell('A2').font  = grayFont;
  ws1.getCell('A2').alignment = { horizontal: 'center' };

  ws1.addRow([]);
  addHeader(ws1, ['Métrica', 'Valor']);

  const summaryData = [
    ['Ingresos Totales',     `$${parseFloat(gs.totalRevenue).toLocaleString('es-CO')}`],
    ['Horas Totales',        `${parseFloat(gs.totalHours).toFixed(1)} h`],
    ['Reservas Finalizadas', gs.finishedReservations],
    ['Reservas Canceladas',  gs.canceledReservations],
  ];
  for (const [metric, value] of summaryData) {
    const row = ws1.addRow({ metric, value });
    row.getCell('metric').font   = { bold: true };
    row.getCell('value').font    = accentFont;
    row.eachCell(c => { c.border = border; c.alignment = { vertical: 'middle' }; });
  }

  // ── Hoja 2: Ingresos por Día ──────────────────────────────────────────────
  const ws2 = wb.addWorksheet('Ingresos por Día');
  ws2.columns = [
    { key: 'dia',     header: 'Día',             width: 18 },
    { key: 'ingreso', header: 'Ingreso (COP)',    width: 22 },
  ];
  addHeader(ws2, ['Día', 'Ingreso (COP)']);

  const dayOrder = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
  for (const day of dayOrder) {
    const row = ws2.addRow({
      dia:     day.charAt(0).toUpperCase() + day.slice(1),
      ingreso: parseFloat(days[day] || 0),
    });
    row.getCell('ingreso').numFmt = '#,##0.00';
    row.eachCell(c => { c.border = border; });
  }

  // Total
  const totalRow = ws2.addRow({ dia: 'TOTAL', ingreso: { formula: `SUM(B5:B${ws2.lastRow.number})` } });
  totalRow.getCell('dia').font     = { bold: true };
  totalRow.getCell('ingreso').font = { bold: true, color: { argb: 'FF1A73E8' } };
  totalRow.getCell('ingreso').numFmt = '#,##0.00';
  totalRow.eachCell(c => { c.border = border; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F7FF' } }; });

  // Gráfico de barras (columnas)
  ws2.addChart = undefined; // ExcelJS charts require extra setup; data is ready for the user to chart

  // ── Hoja 3: Reservas por Hora ─────────────────────────────────────────────
  const ws3 = wb.addWorksheet('Reservas por Hora');
  ws3.columns = [
    { key: 'hora',     header: 'Hora',          width: 12 },
    { key: 'reservas', header: 'Reservas',       width: 16 },
  ];
  addHeader(ws3, ['Hora', 'Reservas']);

  for (const h of hours) {
    const row = ws3.addRow({ hora: `${h.hora}:00`, reservas: h.reservas });
    row.eachCell(c => { c.border = border; });
  }
  if (!hours.length) ws3.addRow({ hora: 'Sin datos', reservas: 0 });

  // ── Serializar ────────────────────────────────────────────────────────────
  return wb.xlsx.writeBuffer();
};
