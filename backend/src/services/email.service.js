const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST  || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const FROM = () => process.env.EMAIL_FROM || 'FourPark <noreply@fourpark.com>';

// ── Recuperación de contraseña ────────────────────────────────────────────────
exports.sendPasswordRecovery = async (to, firstName, link) => {
  await getTransporter().sendMail({
    from:    FROM(),
    to,
    subject: 'Restablece tu contraseña — FourPark',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a73e8">FourPark</h2>
        <p>Hola <strong>${firstName}</strong>,</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Haz clic en el siguiente botón para continuar. El enlace expira en <strong>1 hora</strong>.</p>
        <a href="${link}"
           style="display:inline-block;padding:12px 24px;background:#1a73e8;color:#fff;
                  text-decoration:none;border-radius:4px;margin:16px 0">
          Restablecer contraseña
        </a>
        <p>Si no solicitaste esto, ignora este mensaje.</p>
        <hr style="border:none;border-top:1px solid #eee"/>
        <small style="color:#999">FourPark Colombia &bull; Este correo fue generado automáticamente.</small>
      </div>`,
  });
};

// ── Verificación de correo (bienvenida) ───────────────────────────────────────
exports.sendWelcomeVerification = async (to, firstName, link) => {
  await getTransporter().sendMail({
    from:    FROM(),
    to,
    subject: '¡Bienvenido a FourPark! Verifica tu correo',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a73e8">¡Bienvenido a FourPark, ${firstName}!</h2>
        <p>Gracias por registrarte. Por favor verifica tu dirección de correo electrónico.</p>
        <a href="${link}"
           style="display:inline-block;padding:12px 24px;background:#34a853;color:#fff;
                  text-decoration:none;border-radius:4px;margin:16px 0">
          Verificar mi correo
        </a>
        <p>El enlace expira en <strong>1 hora</strong>.</p>
        <hr style="border:none;border-top:1px solid #eee"/>
        <small style="color:#999">FourPark Colombia &bull; Este correo fue generado automáticamente.</small>
      </div>`,
  });
};

// ── Factura por correo ────────────────────────────────────────────────────────
exports.sendInvoice = async (invoice) => {
  const fmt = (n) => `$${parseFloat(n ?? 0).toLocaleString('es-CO')}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleString('es-CO') : '—';

  await getTransporter().sendMail({
    from:    FROM(),
    to:      invoice.mail,
    subject: `Factura de tu reserva #${invoice.id_invoice} — FourPark`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a73e8">FourPark — Factura #${invoice.id_invoice}</h2>
        <p>Hola <strong>${invoice.first_name} ${invoice.last_name}</strong>,</p>
        <p>Aquí está el resumen de tu reserva en <strong>${invoice.parking_name}</strong>.</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr style="background:#f5f5f5">
            <td style="padding:8px;border:1px solid #ddd"><strong>Parqueadero</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${invoice.parking_name}</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd"><strong>Dirección</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${invoice.parking_address}</td>
          </tr>
          <tr style="background:#f5f5f5">
            <td style="padding:8px;border:1px solid #ddd"><strong>Vehículo</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${invoice.vehicle_name} — ${invoice.vehicle_code}</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd"><strong>Entrada reservada</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${fmtDate(invoice.entry_reservation_date)}</td>
          </tr>
          <tr style="background:#f5f5f5">
            <td style="padding:8px;border:1px solid #ddd"><strong>Salida reservada</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${fmtDate(invoice.departure_reservation_date)}</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd"><strong>Check-in real</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${fmtDate(invoice.check_in)}</td>
          </tr>
          <tr style="background:#f5f5f5">
            <td style="padding:8px;border:1px solid #ddd"><strong>Check-out real</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${fmtDate(invoice.check_out)}</td>
          </tr>
        </table>

        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px">Monto reserva</td>     <td style="padding:6px;text-align:right">${fmt(invoice.reserve_amount)}</td></tr>
          <tr><td style="padding:6px">Servicio</td>          <td style="padding:6px;text-align:right">${fmt(invoice.service_amount)}</td></tr>
          <tr><td style="padding:6px">Tiempo extra</td>      <td style="padding:6px;text-align:right">${fmt(invoice.extra_time_amount)}</td></tr>
          <tr><td style="padding:6px">Reembolso</td>         <td style="padding:6px;text-align:right">-${fmt(invoice.refund_amount)}</td></tr>
          <tr style="background:#1a73e8;color:#fff">
            <td style="padding:8px"><strong>Total</strong></td>
            <td style="padding:8px;text-align:right"><strong>${fmt(invoice.total_amount)}</strong></td>
          </tr>
        </table>

        <p style="margin-top:16px">¡Gracias por usar FourPark!</p>
        <hr style="border:none;border-top:1px solid #eee"/>
        <small style="color:#999">FourPark Colombia &bull; Token de pago: ${invoice.payment_token ?? '—'}</small>
      </div>`,
  });
};
