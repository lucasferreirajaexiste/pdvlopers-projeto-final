const express = require("express");
const router = express.Router();
const loyaltyController = require("../controllers/loyaltyController");

/**
 * @swagger
 * tags:
 *   name: Loyalty
 *   description: Pontuação, recompensas e histórico de fidelidade
 */

/**
 * @swagger
 * /api/loyalty/points/{clientId}:
 *   get:
 *     summary: Obter pontos do cliente
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pontuação do cliente
 */
router.get("/points/:clientId", loyaltyController.getClientPoints);

/**
 * @swagger
 * /api/loyalty/points/add:
 *   post:
 *     summary: Adicionar pontos a um cliente
 *     tags: [Loyalty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId: { type: string }
 *               points: { type: number }
 *     responses:
 *       200:
 *         description: Pontos adicionados
 */
router.post("/points/add", loyaltyController.addPoints);

/**
 * @swagger
 * /api/loyalty/points/redeem:
 *   post:
 *     summary: Resgatar pontos do cliente
 *     tags: [Loyalty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId: { type: string }
 *               points: { type: number }
 *     responses:
 *       200:
 *         description: Pontos resgatados
 */
router.post("/points/redeem", loyaltyController.redeemPoints);

/**
 * @swagger
 * /api/loyalty/rewards:
 *   get:
 *     summary: Listar recompensas
 *     tags: [Loyalty]
 *     responses:
 *       200:
 *         description: Lista de recompensas
 */
router.get("/rewards", loyaltyController.listRewards);

/**
 * @swagger
 * /api/loyalty/rewards:
 *   post:
 *     summary: Criar nova recompensa
 *     tags: [Loyalty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Recompensa criada
 */
router.post("/rewards", loyaltyController.createReward);

/**
 * @swagger
 * /api/loyalty/rewards/{id}:
 *   get:
 *     summary: Obter recompensa por ID
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recompensa encontrada
 */
router.get("/rewards/:id", loyaltyController.getRewardById);

/**
 * @swagger
 * /api/loyalty/rewards/{id}:
 *   put:
 *     summary: Atualizar recompensa
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recompensa atualizada
 */
router.put("/rewards/:id", loyaltyController.updateReward);

/**
 * @swagger
 * /api/loyalty/rewards/{id}:
 *   delete:
 *     summary: Remover recompensa
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recompensa removida
 */
router.delete("/rewards/:id", loyaltyController.deleteReward);

/**
 * @swagger
 * /api/loyalty/history/{clientId}:
 *   get:
 *     summary: Histórico de pontos do cliente
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico do cliente
 */
router.get("/history/:clientId", loyaltyController.getHistory);

module.exports = router;
