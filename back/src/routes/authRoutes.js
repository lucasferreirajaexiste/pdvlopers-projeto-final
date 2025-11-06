// routes/authRoutes.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// Controllers
const auth = require("../controllers/auth.controller");
const twoFA = require("../controllers/2fa.controller");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");

// Helper para propagar erros async ao errorHandler global
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Gerenciamento de autenticação e segurança
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

// Limiter opcional específico para endpoints sensíveis
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// ========== ROTAS PÚBLICAS ==========

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/register", authLimiter, asyncHandler(auth.register));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Autenticação bem sucedida
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", authLimiter, asyncHandler(auth.login));

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Instruções de recuperação enviadas
 */
router.post("/forgot-password", authLimiter, asyncHandler(auth.forgotPassword));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar access token usando refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Novo token de acesso
 */
router.post("/refresh", asyncHandler(auth.refreshToken));

// ========== ROTAS PROTEGIDAS (REQUEREM TOKEN JWT) ==========

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Dados do usuário autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autorizado
 */
router.get("/me", authMiddleware, asyncHandler(auth.getMe));

// ========== 2FA (TWO-FACTOR AUTHENTICATION) ==========

/**
 * @swagger
 * /api/auth/2fa/generate:
 *   get:
 *     summary: Gerar QR Code 2FA para usuário autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR Code e segredo 2FA gerados
 */
router.get("/2fa/generate", authMiddleware, asyncHandler(twoFA.generate2FA));

/**
 * @swagger
 * /api/auth/2fa/setup:
 *   post:
 *     summary: Setup/configurar 2FA (alias de generate)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR Code e segredo 2FA gerados
 */
router.post("/2fa/setup", authMiddleware, asyncHandler(twoFA.generate2FA));

/**
 * @swagger
 * /api/auth/2fa/verify:
 *   post:
 *     summary: Verificar código 2FA
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, secret]
 *             properties:
 *               token: { type: string }
 *               secret: { type: string }
 *     responses:
 *       200:
 *         description: 2FA verificado com sucesso
 *       400:
 *         description: Token inválido
 */
router.post("/2fa/verify", authMiddleware, asyncHandler(twoFA.verify2FA));

module.exports = router;