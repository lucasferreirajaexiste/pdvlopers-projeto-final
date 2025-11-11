const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");
const { sendEmail, sendRecoveryEmail } = require("../utils/email");

// JWT config (com defaults seguros)
const ACCESS_SECRET  = process.env.JWT_SECRET;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  // falhar cedo ajuda a evitar bugs silenciosos
  console.warn("[AUTH] JWT secrets ausentes. Defina JWT_SECRET e JWT_REFRESH_SECRET no .env");
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validações
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Senha deve ter pelo menos 6 caracteres" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email inválido" });
    }

    // existe?
    const userExists = await UserModel.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "Email já cadastrado." });
    }

    // cria
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      message: "Usuário registrado com sucesso.",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Senha inválida." });

    // (se tiver 2FA, valide 'otp' aqui e retorne requires2FA quando faltando)

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES }
    );

    return res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token ausente" });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES }
    );
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token inválido" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email é obrigatório" });

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const token = jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: "15m" });
    const link = `${process.env.FRONTEND_URL || "http://localhost:3001"}/reset-password/${token}`;

    // usa sendRecoveryEmail se existir, senão cai no sendEmail
    if (typeof sendRecoveryEmail === "function") {
      await sendRecoveryEmail(email, link);
    } else {
      await sendEmail({
        to: email,
        subject: "Recuperação de senha",
        text: `Use este link para redefinir sua senha: ${link}`,
        html: `<p>Use este link para redefinir sua senha (expira em 15 minutos):</p><p><a href="${link}">${link}</a></p>`,
      });
    }

    return res.json({ message: "Link de recuperação enviado." });
  } catch (error) {
    console.error("Erro na recuperação de senha:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
