const supabase = require("../config/database");
// Importa funções de serviço e constantes para não repetir código
const { findClientById, updateClientPoints, addTransaction, TRANSACTION_TYPES } = require("../services/loyaltyService");
// Schemas de validação com Joi para garantir dados corretos
const { addPointsSchema, redeemPointsSchema, rewardSchema } = require("../utils/validators");

/**
 * Busca o saldo de pontos de um cliente específico
 */
async function getClientPoints(req, res) {
    const { clientId } = req.params;
    // Busca cliente pelo ID
    const { data, error } = await findClientById(clientId);
    if (error || !data) return res.status(404).json({ error: "Cliente não encontrado" });

    // Retorna ID e saldo de pontos
    res.json({ clientId, points_balance: data.points_balance });
}

/**
 * Adiciona pontos ao saldo de um cliente
}*/
async function addPoints(req, res) {
    // Valida entrada usando Joi
    const { error: validationError } = addPointsSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const { clientId, amount, description } = req.body;

    // Verifica se cliente existe
    const { data: client, error: clientError } = await findClientById(clientId);
    if (clientError || !client) return res.status(404).json({ error: "Cliente não encontrado" });

    // Calcula pontos a partir do valor da compra
    const points = Math.floor((amount / 100) * 10); // regra: 100 reais = 10 pontos

    // Calcula novo saldo
    const newBalance = client.points_balance + points;

    // Atualiza saldo no banco
    await updateClientPoints(clientId, newBalance);

    // Registra a transação no histórico
    await addTransaction({
        client_id: clientId,
        type: TRANSACTION_TYPES.EARN,
        points,
        amount,
        description: description ?? `Compra de R$${amount} gerou ${points} pontos`
    });

    // Retorna sucesso com novo saldo
    res.status(201).json({ message: "Pontos adicionados", clientId, newBalance, earned: points });
}


/**
 * Resgata pontos do cliente em troca de um brinde
    */
async function redeemPoints(req, res) {
  // Valida entrada com Joi
  const { error: validationError } = redeemPointsSchema.validate(req.body);
  if (validationError) return res.status(400).json({ error: validationError.message });

  const { clientId, rewardId, description } = req.body;

  // Verifica se cliente existe
  const { data: client, error: clientError } = await findClientById(clientId);
  if (clientError || !client) return res.status(404).json({ error: "Cliente não encontrado" });

  // Busca o brinde pelo ID
  const { data: reward, error: rewardError } = await supabase
    .from("rewards")
    .select("*")
    .eq("id", rewardId)
    .single();

  if (rewardError || !reward) return res.status(404).json({ error: "Brinde não encontrado" });

  // Checa se há saldo suficiente
  if (client.points_balance < reward.points_required) {
    return res.status(400).json({ error: "Saldo insuficiente" });
  }

  // Calcula novo saldo
  const newBalance = client.points_balance - reward.points_required;

  // Atualiza saldo no banco
  await updateClientPoints(clientId, newBalance);

  // Registra a transação no histórico
  await addTransaction({
    client_id: clientId,
    type: TRANSACTION_TYPES.REDEEM,
    points: reward.points_required, // pontos vêm do brinde
    reward_id: rewardId,
    description: description ?? reward.name // usa descrição enviada ou nome do brinde
  });

  res.status(201).json({
    message: "Pontos resgatados com sucesso",
    clientId,
    reward: reward.name,
    pointsUsed: reward.points_required,
    newBalance
  });
}


/**
 * Lista todos os brindes ativos
 */
async function listRewards(req, res) {
    const { data, error } = await supabase
        .from("rewards")
        .select("*");

    if (error) return res.status(500).json({ error: "Erro ao buscar brindes" });
    res.json(data);
}

/**
 * Cria um novo brinde
 */
async function createReward(req, res) {
    // Valida dados do brinde
    const { error: validationError } = rewardSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const { name, description, points_required} = req.body;

    // Insere brinde no banco
    const { data, error } = await supabase
        .from("rewards")
        .insert([{ name, description, points_required }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: "Erro ao criar brinde" });
    res.status(201).json(data);
}

/**
 * Busca um brinde específico pelo ID
 */
async function getRewardById(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return res.status(404).json({ error: "Brinde não encontrado" });
    res.json(data);
}

/**
 * Atualiza dados de um brinde
 */
async function updateReward(req, res) {
    const { id } = req.params;

    // Monta objeto apenas com os campos enviados
    const updateData = {};
    const { name, description, points_required, active } = req.body;
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (typeof points_required === "number") updateData.points_required = points_required;
    if (typeof active === "boolean") updateData.active = active;

    const { data, error } = await supabase
        .from("rewards")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error || !data) return res.status(404).json({ error: "Brinde não encontrado ou erro ao atualizar" });
    res.json(data);
}

/**
 * Deleta um brinde
 */
async function deleteReward(req, res) {
    const { id } = req.params;
    const { error } = await supabase
        .from("rewards")
        .delete()
        .eq("id", id);

    if (error) return res.status(404).json({ error: "Brinde não encontrado ou erro ao deletar" });
    res.json({ message: "Brinde deletado com sucesso" });
}

/**
 * Retorna histórico de pontos do cliente
 */
async function getHistory(req, res) {
    const { clientId } = req.params;
    const { data, error } = await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: "Erro ao buscar histórico" });
    res.json(data);
}

// Exporta todas as funções do controller
module.exports = {
    getClientPoints,
    addPoints,
    redeemPoints,
    listRewards,
    createReward,
    getRewardById,
    updateReward,
    deleteReward,
    getHistory
};
