// utils/email.js
const nodemailer = require("nodemailer");

let transporter; // cache

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  if (!to) throw new Error("sendEmail: parâmetro 'to' é obrigatório");
  if (!subject) throw new Error("sendEmail: parâmetro 'subject' é obrigatório");

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[sendEmail] OK → ${to} (${info.messageId})`);
    }
    return info;
  } catch (err) {
    console.error("[sendEmail] ERRO →", to, err.message);
    throw err;
  }
}

module.exports = { sendEmail };
