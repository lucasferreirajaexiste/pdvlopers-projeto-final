const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rota para CRIAR um novo cliente (CREATE)
// POST http://localhost:3000/clientes
router.post('/', clienteController.createCliente);

// Rota para LER todos os clientes (READ)
// GET http://localhost:3000/clientes
router.get('/', clienteController.getAllClientes);

// Rota para LER um cliente específico pelo ID (READ)
// GET http://localhost:3000/clientes/1
router.get('/:id', clienteController.getClienteById);

// Rota para ATUALIZAR um cliente pelo ID (UPDATE)
// PUT http://localhost:3000/clientes/1
router.put('/:id', clienteController.updateCliente);

// Rota para DELETAR um cliente pelo ID (DELETE)
// DELETE http://localhost:3000/clientes/1
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;