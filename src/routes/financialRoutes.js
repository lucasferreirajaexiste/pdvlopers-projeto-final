import express from 'express';

// Importação do CRUD
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
} from '../controllers/TransactionController.js';

// Importa o controlador de relatórios 
import { getSummary, getSummaryByCategory } from '../controllers/ReportController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Financial
 *   description: Operações financeiras e transações
 */

/**
 * @swagger
 * /api/financial/transactions:
 *   post:
 *     summary: Criar transação financeira
 *     tags: [Financial]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Transação criada
 */

// Rota para criação de uma nova transação
router.post('/transactions', createTransaction);

// Rota para obtenção de todas as transações
/**
 * @swagger
 * /api/financial/transactions:
 *   get:
 *     summary: Listar transações
 *     tags: [Financial]
 *     responses:
 *       200:
 *         description: Lista de transações
 */
router.get('/transactions', getTransactions);

// Rota para atualização uma transação existente
/**
 * @swagger
 * /api/financial/transactions/{id}:
 *   put:
 *     summary: Atualizar transação
 *     tags: [Financial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transação atualizada
 */
router.put('/transactions/:id', updateTransaction);

// Rota para deleção de uma transação existente
/**
 * @swagger
 * /api/financial/transactions/{id}:
 *   delete:
 *     summary: Deletar transação
 *     tags: [Financial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transação deletada
 */
router.delete('/transactions/:id', deleteTransaction);


// Rota para o controlador de relatórios
/**
 * @swagger
 * /api/financial/summary:
 *   get:
 *     summary: Obter sumário financeiro
 *     tags: [Financial]
 *     responses:
 *       200:
 *         description: Sumário financeiro
 */
router.get('/summary', getSummary);

// Rota para o sumário por categoria
/**
 * @swagger
 * /api/financial/summary/by-category:
 *   get:
 *     summary: Sumário por categoria
 *     tags: [Financial]
 *     responses:
 *       200:
 *         description: Sumário por categoria
 */
router.get('/summary/by-category', getSummaryByCategory);

export default router;