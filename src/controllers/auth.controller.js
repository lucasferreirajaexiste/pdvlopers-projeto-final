const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/users");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = users.find(user => user.email === email);
  if (userExists) return res.status(400).json({ message: "Email já cadastrado." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashedPassword };

  users.push(newUser);
  res.status(201).json({ message: "Usuário registrado com sucesso." });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Senha inválida." });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.json({ token, message: "Login bem-sucedido." });
};

exports.refreshToken = (req, res) => {
  const oldToken = req.headers.authorization?.split(" ")[1];
  if (!oldToken) return res.status(401).json({ message: "Token ausente" });

  try {
    const payload = jwt.verify(oldToken, process.env.JWT_SECRET);
    const newToken = jwt.sign({ id: payload.id, email: payload.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

const { sendRecoveryEmail } = require("../utils/email");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const link = `http://localhost:3000/reset-password/${token}`;

  await sendRecoveryEmail(email, link);
  res.json({ message: "Link de recuperação enviado (simulado)." });
};
