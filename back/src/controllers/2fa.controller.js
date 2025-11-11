const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

exports.generate2FA = async (req, res) => {
  const secret = speakeasy.generateSecret({ name: "MercadinhoVIP" });
  const otpauth = secret.otpauth_url;

  const qr = await qrcode.toDataURL(otpauth);

  res.json({ qrCode: qr, secret: secret.base32 });
};

exports.verify2FA = (req, res) => {
  const { token, secret } = req.body;

  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
  });

  if (verified) res.json({ message: "Token válido" });
  else res.status(400).json({ message: "Token inválido" });
};
