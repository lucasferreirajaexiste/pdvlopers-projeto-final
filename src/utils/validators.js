// Importa a biblioteca Joi, usada para validar dados recebidos nas requisições.
// Isso garante que os dados estejam no formato correto antes de processar.
const Joi = require("joi");

// Esquema de validação para adicionar pontos a um cliente.
// - clientId: ID do cliente (UUID obrigatório).
// - points: número de pontos (inteiro, positivo e obrigatório).
// - description: descrição opcional (pode ser nula ou string vazia).
// - amount: valor monetário relacionado à transação (positivo ou nulo).
const addPointsSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  points: Joi.number().integer().positive().required(),
  description: Joi.string().allow(null, ""),
  amount: Joi.number().positive().allow(null),
});

// Esquema de validação para resgatar pontos.
// - clientId: ID do cliente (UUID obrigatório).
// - points: quantidade de pontos a resgatar (inteiro, positivo e obrigatório).
// - rewardId: ID do brinde ou recompensa (UUID obrigatório).
// - description: descrição opcional.
const redeemPointsSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  points: Joi.number().integer().positive().required(),
  rewardId: Joi.string().uuid().required(),
  description: Joi.string().allow(null, ""),
});

// Esquema de validação para cadastrar ou editar um brinde.
// - name: nome do brinde (obrigatório).
// - description: descrição opcional.
// - points_required: quantidade de pontos necessária para resgatar o brinde (inteiro, positivo e obrigatório).
// - active: indica se o brinde está ativo ou não (opcional, booleano).
const rewardSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  points_required: Joi.number().integer().positive().required(),
  active: Joi.boolean().optional(),
});


module.exports = {
  addPointsSchema,
  redeemPointsSchema,
  rewardSchema,
};
