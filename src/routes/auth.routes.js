const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const twoFA = require("../controllers/2fa.controller");

// Rotas públicas
router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/refresh", auth.refreshToken);

// 2FA
router.get("/2fa/generate", twoFA.generate2FA);
router.post("/2fa/verify", twoFA.verify2FA);

// Rota protegida exemplo
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
