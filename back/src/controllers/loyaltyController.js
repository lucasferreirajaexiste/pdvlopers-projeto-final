// src/controllers/loyaltyController.js
const supabase = require("../config/database");
const Joi = require("joi");

// -------------------- Schemas (Joi) --------------------
const earnSchema = Joi.object({
  clientId: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().pattern(/^\d+$/))
    .required()
    .messages({ "any.required": "clientId é obrigatório" }),
  amount: Joi.number().positive().required().messages({
    "number.base": "amount deve ser numérico",
    "number.positive": "amount deve ser positivo",
    "any.required": "amount é obrigatório",
  }),
  description: Joi.string().allow("").optional(),
});

const redeemSchema = Joi.object({
  clientId: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().pattern(/^\d+$/))
    .required(),
  rewardId: Joi.string().guid({ version: ["uuidv4", "uuidv5", "uuidv1"] }).required(),
  description: Joi.string().allow("").optional(),
});

const rewardCreateSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow("").optional(),
  points_required: Joi.number().integer().min(1).required(),
});

const rewardUpdateSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  description: Joi.string().allow("").optional(),
  points_required: Joi.number().integer().min(1).optional(),
  active: Joi.boolean().optional(),
}).min(1);

// -------------------- Helpers --------------------
async function ensureClientExists(clientId) {
  const id = Number(clientId);
  if (!Number.isInteger(id) || id <= 0) return { exists: false, id: null };

  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("id")
      .eq("id", id)
      .maybeSingle(); // evita throw quando não encontrado

    if (error) {
      console.error("ensureClientExists supabase error:", error);
      return { exists: false, id };
    }
    if (!data) return { exists: false, id };
    return { exists: true, id: data.id };
  } catch (err) {
    console.error("ensureClientExists unexpected error:", err);
    return { exists: false, id };
  }
}

async function getBalance(clientId) {
  const id = Number(clientId);
  try {
    const { data, error } = await supabase
      .from("loyalty_transactions")
      .select("type, points")
      .eq("client_id", id);

    if (error) {
      console.error("getBalance supabase error:", error);
      throw new Error(error.message || "Erro ao calcular saldo");
    }

    const total = (data || []).reduce(
      (acc, r) => acc + (r.type === "earn" ? r.points : -r.points),
      0
    );
    return total;
  } catch (err) {
    console.error("getBalance unexpected error:", err);
    throw err;
  }
}

// -------------------- Controllers --------------------
/**
 * GET /api/loyalty/points/:clientId
 * Retorna saldo atual (somando transações)
 */
async function getClientPoints(req, res) {
  try {
    const { clientId } = req.params;
    const { exists, id } = await ensureClientExists(clientId);
    if (!exists) return res.status(404).json({ error: "Cliente não encontrado" });

    const points = await getBalance(id);
    return res.json({ clientId: id, points });
  } catch (err) {
    console.error("getClientPoints error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

/**
 * POST /api/loyalty/points/add
 * Regra de pontos: 100 reais = 10 pontos (=> points = floor(amount * 0.1))
 */
async function addPoints(req, res) {
  try {
    const payload = await earnSchema.validateAsync(req.body, { convert: true, abortEarly: false });
    const client_id = Number(payload.clientId);
    const amount = Number(payload.amount);
    const description = payload.description || `Compra de R$${amount.toFixed(2)}`;

    // valida cliente
    const { exists } = await ensureClientExists(client_id);
    if (!exists) return res.status(404).json({ error: "Cliente não encontrado" });

    // calcula pontos
    const points = Math.floor(amount * 0.1);

    const { data, error } = await supabase
      .from("loyalty_transactions")
      .insert([{ client_id, type: "earn", points, amount, description }])
      .select()
      .single();

    if (error) {
      console.error("addPoints supabase insert error:", error);
      return res.status(400).json({ error: error.message || "Erro ao registrar pontos" });
    }

    // saldo atualizado
    const newBalance = await getBalance(client_id);
    return res.status(201).json({
      message: "Pontos adicionados",
      item: data,
      balance: newBalance,
    });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ error: err.details.map(d => d.message).join(", ") });
    }
    console.error("addPoints unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

/**
 * POST /api/loyalty/points/redeem
 * Resgata pontos via rewardId (uuid) se houver saldo suficiente
 */
async function redeemPoints(req, res) {
  try {
    const payload = await redeemSchema.validateAsync(req.body, { convert: true, abortEarly: false });
    const client_id = Number(payload.clientId);
    const { rewardId, description } = payload;

    const { exists } = await ensureClientExists(client_id);
    if (!exists) return res.status(404).json({ error: "Cliente não encontrado" });

    // busca reward
    const { data: reward, error: rewardErr } = await supabase
      .from("rewards")
      .select("*")
      .eq("id", rewardId)
      .maybeSingle();

    if (rewardErr) {
      console.error("redeemPoints reward lookup error:", rewardErr);
      return res.status(500).json({ error: rewardErr.message || "Erro ao buscar brinde" });
    }
    if (!reward) return res.status(404).json({ error: "Brinde não encontrado" });

    // verifica saldo
    const current = await getBalance(client_id);
    if (current < reward.points_required) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    // registra transação de resgate
    const { data, error } = await supabase
      .from("loyalty_transactions")
      .insert([{
        client_id,
        type: "redeem",
        points: reward.points_required,
        reward_id: reward.id,
        description: description || reward.name,
      }])
      .select()
      .single();

    if (error) {
      console.error("redeemPoints supabase insert error:", error);
      return res.status(400).json({ error: error.message || "Erro ao registrar resgate" });
    }

    const newBalance = await getBalance(client_id);
    return res.status(201).json({
      message: "Pontos resgatados com sucesso",
      item: data,
      reward: { id: reward.id, name: reward.name, cost: reward.points_required },
      balance: newBalance,
    });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ error: err.details.map(d => d.message).join(", ") });
    }
    console.error("redeemPoints unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

/**
 * GET /api/loyalty/rewards
 */
async function listRewards(_req, res) {
  try {
    const { data, error } = await supabase.from("rewards").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("listRewards supabase error:", error);
      return res.status(500).json({ error: error.message || "Erro ao listar brindes" });
    }
    return res.json(data || []);
  } catch (err) {
    console.error("listRewards unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

/**
 * POST /api/loyalty/rewards
 */
async function createReward(req, res) {
  try {
    const payload = await rewardCreateSchema.validateAsync(req.body, { abortEarly: false });
    const { name, description, points_required } = payload;

    const { data, error } = await supabase
      .from("rewards")
      .insert([{ name, description, points_required }])
      .select()
      .single();

    if (error) {
      console.error("createReward supabase insert error:", error);
      return res.status(400).json({ error: error.message || "Erro ao criar brinde" });
    }
    return res.status(201).json(data);
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ error: err.details.map(d => d.message).join(", ") });
    }
    console.error("createReward unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

/**
 * GET /api/loyalty/rewards/:id
 */
async function getRewardById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("rewards").select("*").eq("id", id).maybeSingle();
    if (error) {
      console.error("getRewardById supabase error:", error);
      return res.status(500).json({ error: error.message || "Erro ao buscar brinde" });
    }
    if (!data) return res.status(404).json({ error: "Brinde não encontrado" });
    return res.json(data);
  } catch (err) {
    console.error("getRewardById unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

/**
 * PUT /api/loyalty/rewards/:id
 */
async function updateReward(req, res) {
  try {
    const { id } = req.params;
    const patch = await rewardUpdateSchema.validateAsync(req.body, { abortEarly: false });

    const { data, error } = await supabase
      .from("rewards")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("updateReward supabase error:", error);
      return res.status(400).json({ error: error.message || "Erro ao atualizar brinde" });
    }
    if (!data) return res.status(404).json({ error: "Brinde não encontrado ou erro ao atualizar" });
    return res.json(data);
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ error: err.details.map(d => d.message).join(", ") });
    console.error("updateReward unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

/**
 * DELETE /api/loyalty/rewards/:id
 */
async function deleteReward(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("rewards").delete().eq("id", id);
    if (error) {
      console.error("deleteReward supabase error:", error);
      return res.status(400).json({ error: error.message || "Erro ao deletar brinde" });
    }
    return res.json({ message: "Brinde deletado com sucesso" });
  } catch (err) {
    console.error("deleteReward unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

/**
 * GET /api/loyalty/history/:clientId
 */
async function getHistory(req, res) {
  try {
    const { clientId } = req.params;
    const { exists, id } = await ensureClientExists(clientId);
    if (!exists) return res.status(404).json({ error: "Cliente não encontrado" });

    const { data, error } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getHistory supabase error:", error);
      return res.status(500).json({ error: error.message || "Erro ao buscar histórico" });
    }
    return res.json(data || []);
  } catch (err) {
    console.error("getHistory unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

module.exports = {
  getClientPoints,
  addPoints,
  redeemPoints,
  listRewards,
  createReward,
  getRewardById,
  updateReward,
  deleteReward,
  getHistory,
};