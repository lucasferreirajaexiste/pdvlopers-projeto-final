const nodemailer = require("nodemailer");

exports.sendRecoveryEmail = async (email, link) => {
  console.log(`[SIMULANDO E-MAIL] Enviar para ${email}:\n${link}`);
};
