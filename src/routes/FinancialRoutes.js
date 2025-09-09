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

// Rota para criação de uma nova transação
router.post('/transactions', createTransaction);

// Rota para obtenção de todas as transações
router.get('/transactions', getTransactions);

// Rota para atualização uma transação existente
router.put('/transactions/:id', updateTransaction);

// Rota para deleção de uma transação existente
router.delete('/transactions/:id', deleteTransaction);


// Rota para o controlador de relatórios
router.get('/summary', getSummary);

// Rota para o sumário por categoria
router.get('/summary/by-category', getSummaryByCategory);

export default router;