// Importa a conexão configurada com o banco de dados Supabase
const supabase = require("../config/database");

// Importa constantes do sistema, incluindo tipos de transações (ex: "compra", "resgate", etc.)
const { TRANSACTION_TYPES } = require("../utils/constants");

/**
 * Busca um cliente pelo ID e retorna apenas o saldo de pontos.
 * 
 * @param {number} clientId - ID do cliente a ser buscado.
 * @returns {Promise<Object>} - Resultado da consulta com o saldo de pontos.
 */
async function findClientById(clientId) {
  return await supabase
    .from("clients")            // Tabela "clients"
    .select("points_balance")   // Seleciona apenas o campo "points_balance" (saldo de pontos)
    .eq("id", clientId)         // Filtra pelo ID do cliente
    .single();                  // Retorna apenas um registro
}

/**
 * Atualiza o saldo de pontos de um cliente específico.
 * 
 * @param {number} clientId - ID do cliente.
 * @param {number} newBalance - Novo saldo de pontos.
 * @returns {Promise<Object>} - Resultado da operação de atualização.
 */
async function updateClientPoints(clientId, newBalance) {
  return await supabase
    .from("clients")                     // Tabela "clients"
    .update({ points_balance: newBalance }) // Define o novo saldo
    .eq("id", clientId);                  // Filtra pelo ID do cliente
}

/**
 * Registra uma nova transação de fidelidade no histórico.
 * 
 * @param {Object} data - Dados da transação.
 * @param {number} data.client_id - ID do cliente.
 * @param {string} data.type - Tipo da transação (ex: "earn", "redeem").
 * @param {number} data.points - Quantidade de pontos envolvidos.
 * @param {number} data.amount - Valor em dinheiro relacionado à transação.
 * @param {string} data.description - Descrição da transação.
 * @param {number|null} [data.reward_id=null] - ID do brinde (se houver).
 * @returns {Promise<Object>} - Resultado da inserção no banco.
 */
async function addTransaction({ client_id, type, points, amount, description, reward_id = null }) {
  return await supabase
    .from("loyalty_transactions") // Tabela de histórico de transações
    .insert([{
      client_id, 
      type, 
      points, 
      amount, 
      description, 
      reward_id
    }]);
}

// Exporta as funções e constantes para uso em outros arquivos
module.exports = {
  findClientById,
  updateClientPoints,
  addTransaction,
  TRANSACTION_TYPES
};


