const PDFDocument = require('pdfkit');

const BLUE  = '#1a73e8';
const DARK  = '#212121';
const GRAY  = '#757575';
const LIGHT = '#f5f5f5';

const fmt     = (n) => `$${parseFloat(n ?? 0).toLocaleString('es-CO')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-CO') : 'Sin filtro';

/**
 * Genera un PDF con las estadísticas de FourPark.
 * Retorna un Buffer.
 */
exports.generateStatsPdf = (data, filters = {}) => {
  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data',  chunk => chunks.push(chunk));
    doc.on('end',   ()    => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { getGeneralStatics: gs, countEarningByDays: days, countReservationByHour: hours } = data;

    // ── Encabezado ────────────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 80).fill(BLUE);
    doc.fillColor('#fff').fontSize(24).font('Helvetica-Bold').text('FourPark', 50, 25);
    doc.fontSize(11).font('Helvetica').text('Reporte de Estadísticas', 50, 52);
    doc.fillColor(DARK).moveDown(3);

    // ── Período ───────────────────────────────────────────────────────────────
    doc.fontSize(10).fillColor(GRAY)
       .text(`Período: ${fmtDate(filters.startDate)} — ${fmtDate(filters.endDate)}`, { align: 'right' });
    doc.moveDown(0.5);

    // ── Tarjetas de resumen ───────────────────────────────────────────────────
    doc.fontSize(14).font('Helvetica-Bold').fillColor(DARK).text('Resumen General');
    doc.moveDown(0.4);

    const cards = [
      { label: 'Ingresos Totales',    value: fmt(gs.totalRevenue) },
      { label: 'Horas Totales',       value: `${parseFloat(gs.totalHours).toFixed(1)} h` },
      { label: 'Reservas Finalizadas',value: gs.finishedReservations.toString() },
      { label: 'Reservas Canceladas', value: gs.canceledReservations.toString() },
    ];

    const cardW  = 115;
    const cardH  = 55;
    const startX = 50;
    let   cx     = startX;
    const cy     = doc.y;

    for (const card of cards) {
      doc.roundedRect(cx, cy, cardW, cardH, 6).fill(LIGHT);
      doc.fontSize(9).fillColor(GRAY).font('Helvetica')
         .text(card.label, cx + 8, cy + 8, { width: cardW - 16 });
      doc.fontSize(16).fillColor(BLUE).font('Helvetica-Bold')
         .text(card.value, cx + 8, cy + 24, { width: cardW - 16 });
      cx += cardW + 10;
    }
    doc.moveDown(4.5);

    // ── Ingresos por día ──────────────────────────────────────────────────────
    doc.fontSize(14).font('Helvetica-Bold').fillColor(DARK).text('Ingresos por Día de Semana');
    doc.moveDown(0.4);

    const dayOrder = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
    const maxDay   = Math.max(...dayOrder.map(d => days[d] || 0), 1);

    for (const day of dayOrder) {
      const val   = days[day] || 0;
      const barW  = Math.round((val / maxDay) * 350);
      const y     = doc.y;
      doc.fontSize(9).fillColor(DARK).font('Helvetica')
         .text(day.charAt(0).toUpperCase() + day.slice(1), 50, y, { width: 80 });
      doc.roundedRect(140, y, barW || 2, 12, 2).fill(BLUE);
      doc.fontSize(9).fillColor(GRAY)
         .text(fmt(val), 145 + (barW || 2), y, { width: 120 });
      doc.moveDown(0.8);
    }
    doc.moveDown(0.5);

    // ── Reservas por hora ─────────────────────────────────────────────────────
    if (hours.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor(DARK).text('Reservas por Hora del Día');
      doc.moveDown(0.4);

      const maxHour = Math.max(...hours.map(h => h.reservas), 1);
      for (const h of hours) {
        const barW = Math.round((h.reservas / maxHour) * 350);
        const y    = doc.y;
        doc.fontSize(9).fillColor(DARK).font('Helvetica')
           .text(`${h.hora}:00`, 50, y, { width: 80 });
        doc.roundedRect(140, y, barW || 2, 12, 2).fill('#34a853');
        doc.fontSize(9).fillColor(GRAY)
           .text(`${h.reservas} reservas`, 145 + (barW || 2), y, { width: 120 });
        doc.moveDown(0.8);
      }
    }

    // ── Pie de página ─────────────────────────────────────────────────────────
    doc.fontSize(8).fillColor(GRAY)
       .text(
         `Generado el ${new Date().toLocaleString('es-CO')} — FourPark Colombia`,
         50, doc.page.height - 40,
         { align: 'center', width: doc.page.width - 100 }
       );

    doc.end();
  });
};
