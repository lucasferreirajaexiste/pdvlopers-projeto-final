// src/controllers/ReportController.js
import supabase from "../config/database.js";

/**
 * Relatório Financeiro — endpoints para gráficos
 * Tenta RPC; se indisponível ou vier vazia (no by-category), cai para fallback em JS.
 * Enum mapeado via .env TRANSACTION_TYPE_DB_VALUES (default: entrada,saida)
 */

// --- helpers comuns ---
function badRequest(res, message) {
  return res.status(400).json({ error: message });
}
function isISODate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}
const round2 = (n) => Number((n || 0).toFixed(2));

// --- mapping de enum (mesma ideia do TransactionController) ---
const [DB_CREDIT_RAW, DB_DEBIT_RAW] = String(
  process.env.TRANSACTION_TYPE_DB_VALUES || "entrada,saida"
).split(",");
const DB_CREDIT = (DB_CREDIT_RAW || "entrada").trim();
const DB_DEBIT  = (DB_DEBIT_RAW  || "saida").trim();
const norm = (s) => String(s ?? "").toLowerCase().trim();
const isCreditDB = (t) => norm(t) === norm(DB_CREDIT);
const isDebitDB  = (t) => norm(t) === norm(DB_DEBIT);

// ---------- FALLBACKS (sem RPC) ----------
async function fallbackSummary(start_date, end_date) {
  const { data, error } = await supabase
    .from("transactions")
    .select("amount,type,transaction_date")
    .gte("transaction_date", start_date)
    .lte("transaction_date", end_date);

  if (error) throw error;

  let credit = 0, debit = 0;
  for (const r of data || []) {
    const amt = Number(r.amount) || 0;
    if (isCreditDB(r.type)) credit += amt;
    else if (isDebitDB(r.type)) debit += amt;
  }

  const balance = credit - debit;
  return {
    start_date,
    end_date,
    total_credit: round2(credit),
    total_debit: round2(debit),
    balance: round2(balance),
  };
}

async function fallbackSummaryByCategory(start_date, end_date, expandCategory) {
  const { data, error } = await supabase
    .from("transactions")
    .select("amount,type,category_id,transaction_date")
    .gte("transaction_date", start_date)
    .lte("transaction_date", end_date);

  if (error) throw error;

  // agrega por category_id (ou null)
  const acc = new Map(); // key: category_id -> { category_id, total_credit, total_debit, balance }
  for (const r of data || []) {
    const key = r.category_id ?? null;
    if (!acc.has(key)) acc.set(key, { category_id: key, total_credit: 0, total_debit: 0, balance: 0 });
    const item = acc.get(key);
    const amt = Number(r.amount) || 0;
    if (isCreditDB(r.type)) item.total_credit += amt;
    else if (isDebitDB(r.type)) item.total_debit += amt;
  }

  let rows = Array.from(acc.values()).map((x) => ({
    ...x,
    total_credit: round2(x.total_credit),
    total_debit: round2(x.total_debit),
    balance: round2(x.total_credit - x.total_debit),
  }));

  // opcional: expandir nomes de categorias (sem FK)
  if (expandCategory) {
    const ids = [...new Set(rows.map((r) => r.category_id).filter((v) => v != null))];
    let byId = {};
    if (ids.length) {
      const { data: cats, error: cErr } = await supabase
        .from("categories")
        .select("id,name")
        .in("id", ids);
      if (cErr) throw cErr;
      byId = Object.fromEntries((cats || []).map((c) => [c.id, c.name]));
    }
    rows = rows.map((r) => ({
      ...r,
      category_name: r.category_id == null ? "Sem categoria" : (byId[r.category_id] ?? null),
    }));
  }

  return rows;
}

// ---------- ENDPOINTS ----------
export async function getSummary(req, res) {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return badRequest(res, "Os parâmetros 'start_date' e 'end_date' são obrigatórios (YYYY-MM-DD).");
    }
    if (!isISODate(start_date) || !isISODate(end_date)) {
      return badRequest(res, "Datas inválidas. Use o formato YYYY-MM-DD.");
    }

    // tenta RPC
    const rpc = await supabase.rpc("get_financial_summary", {
      p_start_date: start_date,
      p_end_date: end_date,
    });

    if (!rpc.error && rpc.data != null) {
      // deixe o shape exatamente como a função retorna
      return res.status(200).json(rpc.data ?? []);
    }

    // fallback JS
    const fb = await fallbackSummary(start_date, end_date);
    return res.status(200).json(fb);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getSummaryByCategory(req, res) {
  try {
    const { start_date, end_date, expand } = req.query;

    if (!start_date || !end_date) {
      return badRequest(res, "Os parâmetros 'start_date' e 'end_date' são obrigatórios (YYYY-MM-DD).");
    }
    if (!isISODate(start_date) || !isISODate(end_date)) {
      return badRequest(res, "Datas inválidas. Use o formato YYYY-MM-DD.");
    }

    const rpc = await supabase.rpc("get_summary_by_category", {
      p_start_date: start_date,
      p_end_date: end_date,
    });

    // usa RPC apenas se trouxe linhas (evita retornar [] e perder o fallback)
    const useRpc = !rpc.error && Array.isArray(rpc.data) && rpc.data.length > 0;
    if (useRpc) {
      return res.status(200).json(rpc.data);
    }

    const wantCategory = String(expand || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .includes("category");

    const fb = await fallbackSummaryByCategory(start_date, end_date, wantCategory);
    return res.status(200).json(fb);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default { getSummary, getSummaryByCategory };
