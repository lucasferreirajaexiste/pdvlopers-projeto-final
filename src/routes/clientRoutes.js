const express = require("express");
const router = express.Router();
const ClientsService = require("../services/clients.service");
// opcional: proteger com auth
// const auth = require("../middleware/authMiddleware");

const ok = (res, data) => res.json(data);
const created = (res, data) => res.status(201).json(data);
const badReq = (res, msg) => res.status(400).json({ error: msg });
const notFound = (res, msg = "Cliente não encontrado") => res.status(404).json({ error: msg });
const fail = (res, err) => res.status(500).json({ message: "Erro interno", error: err?.message });

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Operações relacionadas a clientes
 */
/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
/** GET /api/clients */
router.get("/", async (_req, res) => {
  try {
    const items = await ClientsService.findAllClientes();
    return ok(res, { items });
  } catch (err) {
    return fail(res, err);
  }
});

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Obter cliente por ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
/** GET /api/clients/:id */
router.get("/:id", async (req, res) => {
  try {
    const item = await ClientsService.findClienteById(req.params.id);
    if (!item) return notFound(res);
    return ok(res, { item });
  } catch (err) {
    return fail(res, err);
  }
});

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Criar um novo cliente
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, cpf]
 *             properties:
 *               nome: { type: string }
 *               cpf: { type: string }
 *     responses:
 *       201:
 *         description: Cliente criado
 *       409:
 *         description: "Conflito (ex.: CPF já existe)"
 */
/** POST /api/clients */
router.post("/", async (req, res) => {
  try {
    const { nome, cpf } = req.body || {};
    if (!nome || !cpf) return badReq(res, "nome e cpf são obrigatórios");

    const result = await ClientsService.createCliente(req.body);
    if (result?.success === false) {
      return res.status(409).json({ error: result.message });
    }
    return created(res, { item: result.cliente });
  } catch (err) {
    return fail(res, err);
  }
});

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *       404:
 *         description: Cliente não encontrado
 */
/** PUT /api/clients/:id */
router.put("/:id", async (req, res) => {
  try {
    const item = await ClientsService.updateCliente(req.params.id, req.body || {});
    if (!item) return notFound(res);
    return ok(res, { item });
  } catch (err) {
    return fail(res, err);
  }
});

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Remover cliente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido
 *       404:
 *         description: Cliente não encontrado
 */
/** DELETE /api/clients/:id */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ClientsService.deleteCliente(req.params.id);
    if (!deleted) return notFound(res);
    return ok(res, { message: "Cliente removido", id: req.params.id });
  } catch (err) {
    return fail(res, err);
  }
});

module.exports = router;
