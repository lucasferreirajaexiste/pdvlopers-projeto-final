import supabase from "../config/database.js";

/**
 * CRUD - Transações (ESM)
 * TRANSACTION_TYPE_DB_VALUES deve bater com o enum do DB (ex: "entrada,saida")
 */

// --- helpers ---
const [DB_CREDIT_RAW, DB_DEBIT_RAW] = String(
  process.env.TRANSACTION_TYPE_DB_VALUES || "entrada,saida"
).split(",");
const DB_CREDIT = (DB_CREDIT_RAW || "entrada").trim();
const DB_DEBIT = (DB_DEBIT_RAW || "saida").trim();

const badRequest = (res, msg) => res.status(400).json({ error: msg });
const isISODate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const norm = (s) => String(s || "").toLowerCase().trim();

// aceita várias chaves (snake / camel / aliases) e retorna o primeiro definido
const readField = (obj, ...keys) => {
  if (obj == null) return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined) return obj[k];
  }
  return undefined;
};

const isTypeAccepted = (t) =>
  ["credit", "debit", norm(DB_CREDIT), norm(DB_DEBIT)].includes(norm(t));

const mapApiToDb = (t) => {
  const k = norm(t);
  if (k === "credit") return DB_CREDIT;
  if (k === "debit") return DB_DEBIT;
  if (k === norm(DB_CREDIT)) return DB_CREDIT;
  if (k === norm(DB_DEBIT)) return DB_DEBIT;
  return t;
};

// Mapeia valor do DB para o formato que o front atual usa: "entrada" | "saida"
const mapDbToFront = (t) => {
  const k = norm(t);
  if (k === "entrada" || k === "saida") return k;
  if (k === "credit") return "entrada";
  if (k === "debit") return "saida";
  if (k === norm(DB_CREDIT)) return norm(DB_CREDIT);
  if (k === norm(DB_DEBIT)) return norm(DB_DEBIT);
  return k;
};

const formatDateYYYYMMDD = (val) => {
  if (val == null) return null;
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const maybe = new Date(val);
    if (!Number.isNaN(maybe.getTime())) return maybe.toISOString().slice(0, 10);
    return val;
  }
  if (val instanceof Date) {
    return val.toISOString().slice(0, 10);
  }
  try {
    const d = new Date(val);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch (e) {}
  return null;
};

const toFrontResponse = (row) => {
  if (!row) return row;
  const amountNum = row.amount == null ? row.amount : Number(row.amount);
  return {
    id: typeof row.id === "string" && /^\d+$/.test(row.id) ? Number(row.id) : row.id,
    description: row.description,
    amount: Number.isNaN(amountNum) ? row.amount : amountNum,
    type: mapDbToFront(row.type),
    date: formatDateYYYYMMDD(row.transaction_date ?? row.date ?? null),
    categoryId: row.category_id ?? row.categoryId ?? null,
  };
};

// Helper: resolve category input (number or name). Retorna { id, created }
// - Se categoryRaw é number -> retorna id
// - Se string -> procura por name (case-insensitive)
// - Se não encontrar cria a categoria automaticamente
async function resolveCategory(categoryRaw) {
  if (categoryRaw == null) return { id: null, created: false };

  // se for numérico, usa direto
  if (Number.isFinite(Number(categoryRaw))) {
    return { id: Number(categoryRaw), created: false };
  }

  const name = String(categoryRaw).trim();
  if (!name) return { id: null, created: false };

  try {
    // procurar categoria por nome (case-insensitive)
    const { data: existing, error: selErr } = await supabase
      .from("categories")
      .select("id, name")
      .ilike("name", name)
      .maybeSingle();

    if (selErr) {
      console.error("resolveCategory select error:", selErr);
      throw selErr;
    }

    if (existing && existing.id) {
      return { id: Number(existing.id), created: false };
    }

    // não existe: criar nova categoria
    const { data: created, error: insErr } = await supabase
      .from("categories")
      .insert([{ name, description: null }])
      .select()
      .single();

    if (insErr) {
      console.error("resolveCategory insert error:", insErr);
      throw insErr;
    }

    return { id: Number(created.id), created: true };
  } catch (err) {
    throw err;
  }
}

// (opcional) log diagnóstica
console.log(
  "[Finance] Enum mapping -> DB_CREDIT:",
  DB_CREDIT,
  "| DB_DEBIT:",
  DB_DEBIT,
  "| API expects:",
  "description, amount, type, date, categoryId/category"
);

// ------------------- Controllers -------------------

/** Criar transação */
export async function createTransaction(req, res) {
  try {
    const description = readField(req.body, "description", "title");
    const amount = readField(req.body, "amount", "value", "valor");
    const type = readField(req.body, "type", "tipo");
    const transaction_date = readField(
      req.body,
      "transaction_date",
      "transactionDate",
      "date"
    );
    const category_raw = readField(
      req.body,
      "category_id",
      "categoryId",
      "category"
    );

    if (!description || amount == null || !type || !transaction_date) {
      return badRequest(res, "Todos os campos obrigatórios devem ser preenchidos.");
    }

    if (!isTypeAccepted(type)) {
      return badRequest(res, "Tipo inválido. Use 'entrada'/'saida' ou 'credit'/'debit'.");
    }

    const numAmountRaw = Number(amount);
    if (!Number.isFinite(numAmountRaw)) return badRequest(res, "amount deve ser numérico.");
    // normaliza para 2 casas antes de inserir e garante POSITIVO
    const numAmount = Number(Math.abs(numAmountRaw).toFixed(2));

    if (!isISODate(transaction_date)) return badRequest(res, "transaction_date deve ser YYYY-MM-DD.");

    // resolve category (aceita id ou nome)
    let category_id = null;
    try {
      const resolved = await resolveCategory(category_raw);
      category_id = resolved.id;
    } catch (err) {
      console.error("Erro ao resolver categoria:", err);
      return res.status(500).json({ error: "Erro ao resolver categoria" });
    }

    const insertObj = {
      description: String(description),
      amount: numAmount,
      type: mapApiToDb(type),
      transaction_date,
      category_id: category_id ?? null,
    };

    const { data, error } = await supabase.from("transactions").insert([insertObj]).select().single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message || "Erro ao inserir transação no banco." });
    }

    const normalized = toFrontResponse(data);
    return res.status(201).json(normalized);
  } catch (error) {
    console.error("TransactionController.createTransaction error:", error);
    const message = error?.message || "Erro interno do servidor";
    return res.status(500).json({ error: message });
  }
}

/** Listar transações (filtros: category_id/categoryId, type, from, to) — sem JOIN */
export async function getTransactions(req, res) {
  try {
    const category_id_raw = readField(req.query, "category_id", "categoryId", "category");
    const type = readField(req.query, "type", "tipo");
    const from = readField(req.query, "from", "start");
    const to = readField(req.query, "to", "end");

    let query = supabase
      .from("transactions")
      .select(`
        id,
        description,
        amount,
        type,
        transaction_date,
        category_id
      `)
      .order("transaction_date", { ascending: false })
      .order("id", { ascending: false });

    if (category_id_raw) {
      if (Number.isFinite(Number(category_id_raw))) {
        query = query.eq("category_id", Number(category_id_raw));
      } else {
        try {
          const resolved = await resolveCategory(category_id_raw);
          if (resolved && resolved.id) query = query.eq("category_id", resolved.id);
        } catch (err) {
          console.error("Erro ao resolver category filter:", err);
        }
      }
    }

    if (type) {
      if (!isTypeAccepted(type)) return badRequest(res, "type inválido. Use 'entrada'/'saida' ou 'credit'/'debit'.");
      query = query.eq("type", mapApiToDb(type));
    }
    if (from) {
      if (!isISODate(from)) return badRequest(res, "from inválido. Use YYYY-MM-DD.");
      query = query.gte("transaction_date", from);
    }
    if (to) {
      if (!isISODate(to)) return badRequest(res, "to inválido. Use YYYY-MM-DD.");
      query = query.lte("transaction_date", to);
    }

    const { data, error } = await query;
    if (error) throw error;

    const normalized = (data || []).map((r) => toFrontResponse(r));
    return res.status(200).json(normalized);
  } catch (error) {
    console.error("TransactionController.getTransactions error:", error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
}

/** Buscar transação por id (GET single) */
export async function getTransaction(req, res) {
  try {
    const { id } = req.params;
    if (!id) return badRequest(res, "O ID da transação é obrigatório.");

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        description,
        amount,
        type,
        transaction_date,
        category_id
      `)
      .eq("id", Number(id))
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Transação não encontrada." });

    return res.status(200).json(toFrontResponse(data));
  } catch (error) {
    console.error("TransactionController.getTransaction error:", error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
}

/** Atualizar transação (partial update) */
export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    if (!id) return badRequest(res, "O ID da transação é obrigatório.");

    const description = readField(req.body, "description", "title");
    const amount = readField(req.body, "amount", "value", "valor");
    const type = readField(req.body, "type", "tipo");
    const transaction_date = readField(
      req.body,
      "transaction_date",
      "transactionDate",
      "date"
    );
    const category_raw = readField(
      req.body,
      "category_id",
      "categoryId",
      "category"
    );

    const updates = {};
    if (description !== undefined) updates.description = String(description);
    if (amount !== undefined) {
      const num = Number(amount);
      if (!Number.isFinite(num)) return badRequest(res, "amount deve ser numérico.");
      // garante positivo
      updates.amount = Number(Math.abs(num).toFixed(2));
    }
    if (type !== undefined) {
      if (!isTypeAccepted(type)) return badRequest(res, "Tipo inválido. Use 'entrada'/'saida' ou 'credit'/'debit'.");
      updates.type = mapApiToDb(type);
    }
    if (transaction_date !== undefined) {
      if (!isISODate(transaction_date)) return badRequest(res, "transaction_date deve ser YYYY-MM-DD.");
      updates.transaction_date = transaction_date;
    }
    if (category_raw !== undefined) {
      try {
        const resolved = await resolveCategory(category_raw);
        updates.category_id = resolved.id ?? null;
      } catch (err) {
        console.error("Erro ao resolver categoria no update:", err);
        return res.status(500).json({ error: "Erro ao resolver categoria" });
      }
    }

    if (Object.keys(updates).length === 0) return badRequest(res, "Nenhum campo para atualizar.");

    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", Number(id))
      .select()
      .maybeSingle();

    if (error) {
      console.error("TransactionController.updateTransaction supabase error:", error);
      throw error;
    }
    if (!data) return res.status(404).json({ error: "Transação não encontrada." });

    const normalized = toFrontResponse(data);
    return res.status(200).json(normalized);
  } catch (error) {
    console.error("TransactionController.updateTransaction error:", error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
}

/** Deletar transação */
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (!id) return badRequest(res, "O ID da transação é obrigatório.");

    const { error } = await supabase.from("transactions").delete().eq("id", Number(id));
    if (error) {
      console.error("TransactionController.deleteTransaction supabase error:", error);
      throw error;
    }

    return res.status(204).send();
  } catch (error) {
    console.error("TransactionController.deleteTransaction error:", error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
}

/** Listar categorias (GET /api/financial/categories) */
export async function getCategories(_req, res) {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, description")
      .order("name", { ascending: true });

    if (error) {
      console.error("getCategories supabase error:", error);
      return res.status(500).json({ error: error.message || "Erro ao listar categorias" });
    }
    return res.status(200).json(data || []);
  } catch (err) {
    console.error("getCategories unexpected error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}

export default {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
};