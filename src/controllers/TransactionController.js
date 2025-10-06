// src/controllers/TransactionController.js
import supabase from "../config/database.js";

/**
 * CRUD - Transações (ESM)
 * Mapeamento de tipo (API -> DB) por .env:
 *   TRANSACTION_TYPE_DB_VALUES=entrada,saida   (padrão)
 *   ou: TRANSACTION_TYPE_DB_VALUES=credit,debit
 *   ou: TRANSACTION_TYPE_DB_VALUES=CREDIT,DEBIT
 */

// --- helpers ---
const [DB_CREDIT_RAW, DB_DEBIT_RAW] = String(
  process.env.TRANSACTION_TYPE_DB_VALUES || "entrada,saida"
).split(",");
const DB_CREDIT = (DB_CREDIT_RAW || "entrada").trim();
const DB_DEBIT  = (DB_DEBIT_RAW  || "saida").trim();

const badRequest = (res, msg) => res.status(400).json({ error: msg });
const isISODate  = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const norm       = (s) => String(s).toLowerCase().trim();

const isTypeAccepted = (t) =>
  ["credit", "debit", norm(DB_CREDIT), norm(DB_DEBIT)].includes(norm(t));

const mapApiToDb = (t) => {
  const k = norm(t);
  if (k === "credit") return DB_CREDIT;
  if (k === "debit")  return DB_DEBIT;
  if (k === norm(DB_CREDIT)) return DB_CREDIT; // entrada -> entrada
  if (k === norm(DB_DEBIT))  return DB_DEBIT;  // saida   -> saida
  return t;
};

const mapDbToApi = (t) => {
  const k = norm(t);
  if (k === norm(DB_CREDIT)) return "credit";
  if (k === norm(DB_DEBIT))  return "debit";
  return t;
};

// (opcional) log para diagnosticar o mapeamento carregado
console.log("[Finance] Enum mapping -> credit:", DB_CREDIT, "| debit:", DB_DEBIT);

/** Criar transação */
export async function createTransaction(req, res) {
  try {
    let { description, amount, type, transaction_date, category_id } = req.body;

    if (!description || amount == null || !type || !transaction_date) {
      return badRequest(res, "Todos os campos obrigatórios devem ser preenchidos.");
    }
    if (!isTypeAccepted(type)) {
      return badRequest(res, "Tipo inválido. Use 'credit' ou 'debit'.");
    }
    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount)) return badRequest(res, "amount deve ser numérico.");
    if (!isISODate(transaction_date)) return badRequest(res, "transaction_date deve ser YYYY-MM-DD.");
    if (category_id != null && !Number.isFinite(Number(category_id))) {
      return badRequest(res, "category_id deve ser numérico.");
    }

    const insertObj = {
      description: String(description),
      amount: numAmount,
      type: mapApiToDb(type), // mapeia para enum do DB
      transaction_date,
      category_id: category_id ?? null,
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert([insertObj])
      .select()
      .single();

    if (error) throw error;

    // normaliza a resposta para a API
    data.type = mapDbToApi(data.type);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/** Listar transações (filtros: category_id, type, from, to) — sem JOIN */
export async function getTransactions(req, res) {
  try {
    const { category_id, type, from, to } = req.query;

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

    if (category_id) query = query.eq("category_id", Number(category_id));
    if (type) {
      if (!isTypeAccepted(type)) return badRequest(res, "type inválido. Use 'credit' ou 'debit'.");
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

    const normalized = (data || []).map((r) => ({ ...r, type: mapDbToApi(r.type) }));
    return res.status(200).json(normalized);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/** Atualizar transação (partial update) */
export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    if (!id) return badRequest(res, "O ID da transação é obrigatório.");

    const { description, amount, type, transaction_date, category_id } = req.body;

    const updates = {};
    if (description !== undefined) updates.description = String(description);
    if (amount !== undefined) {
      const num = Number(amount);
      if (!Number.isFinite(num)) return badRequest(res, "amount deve ser numérico.");
      updates.amount = num;
    }
    if (type !== undefined) {
      if (!isTypeAccepted(type)) return badRequest(res, "Tipo inválido. Use 'credit' ou 'debit'.");
      updates.type = mapApiToDb(type);
    }
    if (transaction_date !== undefined) {
      if (!isISODate(transaction_date)) return badRequest(res, "transaction_date deve ser YYYY-MM-DD.");
      updates.transaction_date = transaction_date;
    }
    if (category_id !== undefined) {
      if (category_id != null && !Number.isFinite(Number(category_id))) {
        return badRequest(res, "category_id deve ser numérico.");
      }
      updates.category_id = category_id ?? null;
    }

    if (Object.keys(updates).length === 0) return badRequest(res, "Nenhum campo para atualizar.");

    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", Number(id))
      .select()
      .maybeSingle(); // evita "Cannot coerce ... single JSON"

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Transação não encontrada." });

    data.type = mapDbToApi(data.type);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/** Deletar transação */
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (!id) return badRequest(res, "O ID da transação é obrigatório.");

    const { error } = await supabase.from("transactions").delete().eq("id", Number(id));
    if (error) throw error;

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default { createTransaction, getTransactions, updateTransaction, deleteTransaction };
