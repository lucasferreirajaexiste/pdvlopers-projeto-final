// routes/promotionRoutes.js
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/authMiddleware");

const supabase = require("../config/database");
const { sendEmail } = require("../utils/email");

// ---------- Helpers ----------
const parseBool = (v) => (typeof v === "boolean" ? v : v === "true");
const isISODate = (v) => !v || !isNaN(Date.parse(v));

const ok = (res, data) => res.json(data);
const created = (res, data) => res.status(201).json(data);
const notFound = (res, msg = "Promoção não encontrada") => res.status(404).json({ error: msg });
const badReq = (res, msg) => res.status(400).json({ error: msg });
const fail = (res, err) => res.status(500).json({ error: err?.message || "Erro interno" });

// ---------- Segmentos ----------
const escapeHtml = (s = "") =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// ---------- Segmentos ----------
const SEGMENTS = [
  { key: "ALL", label: "Todos os clientes" },
  { key: "VIP", label: "Clientes VIP" },
  { key: "GOLD", label: "Clientes Gold" },
  { key: "SILVER", label: "Clientes Silver" },
  { key: "INACTIVE", label: "Clientes inativos" },
];
const SEGMENT_KEYS = new Set(SEGMENTS.map(s => s.key));

const TIER_LIMITS = {
  VIP_MIN: Number.parseInt(process.env.LOYALTY_VIP_MIN || "1000", 10),
  GOLD_MIN: Number.parseInt(process.env.LOYALTY_GOLD_MIN || "500", 10),
  SILVER_MIN: Number.parseInt(process.env.LOYALTY_SILVER_MIN || "200", 10),
  INACTIVE_DAYS: Number.parseInt(process.env.LOYALTY_INACTIVE_DAYS || "90", 10),
};

/** Templating simples: {{nome}} */
const applyTemplate = (text, cliente) =>
  String(text || "").replaceAll("{{nome}}", cliente?.nome || "");

/** Busca clientes por IDs, padronizando campos básicos */
async function fetchClientesByIds(ids) {
  if (!ids?.length) return [];
  const { data, error } = await supabase
    .from("clientes")
    .select("id, nome, email, telefone")
    .in("id", ids)
    .eq("optout_email", false); 
  if (error) throw error;
  return data || [];
}

/** Resolve audiência conforme segmento (retorna [{ id, nome, email, telefone }]) */
/** Resolve audiência conforme segmento (retorna [{ id, nome, email, telefone }]) */
async function getAudienceBySegment({ segment }) {
  if (segment === "ALL") {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nome, email, telefone")
      .eq("optout_email", false);
    if (error) throw error;
    return data || [];
  }

  // Segmentos por pontuação — requer a view vw_cliente_pontos
  if (segment === "VIP" || segment === "GOLD" || segment === "SILVER") {
    const { VIP_MIN, GOLD_MIN, SILVER_MIN } = TIER_LIMITS;

    let gte = null;
    let lt = null;

    if (segment === "VIP") {
      gte = VIP_MIN;            // [VIP_MIN, ∞)
      lt = null;
    } else if (segment === "GOLD") {
      gte = GOLD_MIN;           // [GOLD_MIN, VIP_MIN)
      lt = VIP_MIN;
    } else if (segment === "SILVER") {
      gte = SILVER_MIN;         // [SILVER_MIN, GOLD_MIN)
      lt = GOLD_MIN;
    }

    let query = supabase
      .from("vw_cliente_pontos")
      .select("cliente_id, pontos");

    if (gte !== null) query = query.gte("pontos", gte);
    if (lt !== null) query = query.lt("pontos", lt);

    const { data, error } = await query;
    if (error) throw error;

    const ids = (data || []).map((r) => r.cliente_id);
    return await fetchClientesByIds(ids);
  }

  // Inativos: sem transação de fidelidade recente (>= INACTIVE_DAYS sem atividade)
  if (segment === "INACTIVE") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - TIER_LIMITS.INACTIVE_DAYS);

    // pega todas as transações ordenadas por data desc
    const { data: txs, error: txErr } = await supabase
      .from("loyalty_transactions")
      .select("client_id, created_at")
      .order("created_at", { ascending: false });
    if (txErr) throw txErr;

    // mapeia a última transação por cliente
    const lastByClient = new Map();
    (txs || []).forEach((row) => {
      if (!lastByClient.has(row.client_id)) {
        lastByClient.set(row.client_id, row.created_at);
      }
    });

    // busca todos os clientes
    const { data: allClientes, error: cliErr } = await supabase
      .from("clientes")
      .select("id, nome, email, telefone");
    if (cliErr) throw cliErr;

    const inactive = (allClientes || []).filter((c) => {
      const last = lastByClient.get(c.id);
      if (!last) return true; // nunca pontuou
      return new Date(last) < cutoff;
    });

    return inactive;
  }

  // 👇 garante erro claro se vier algo fora da lista
  throw new Error("segment inválido");
}



// ---------- ROTAS LITERAIS PRIMEIRO (evitam colisão com /:id) ----------

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Gestão de promoções e envios
 */

/**
 * @swagger
 * /api/promotions/segments:
 *   get:
 *     summary: Listar segmentos e pré-visualizar audiência
 *     tags: [Promotions]
 *     parameters:
 *       - in: query
 *         name: preview
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: segment
 *         schema:
 *           type: string
 *           enum: [ALL, VIP, GOLD, SILVER, INACTIVE]
 *     responses:
 *       200:
 *         description: Lista de segmentos ou pré-visualização
 */
router.get("/segments", async (req, res) => {
  const preview = parseBool(req.query.preview);
  const segment = req.query.segment;

  if (!preview) return ok(res, { list: SEGMENTS, limits: TIER_LIMITS });

  if (!segment) return badReq(res, "Informe segment para preview");
  if (!SEGMENT_KEYS.has(segment)) return badReq(res, "segment inválido"); // +++

  try {
    const audience = await getAudienceBySegment({ segment });
    return ok(res, {
      list: SEGMENTS,
      limits: TIER_LIMITS,
      preview: { count: audience.length, sample: audience.slice(0, 20) },
    });
  } catch (err) {
    return fail(res, err);
  }
});

const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Muitas solicitações de envio. Tente novamente mais tarde." },
});

/**
 * POST /api/promotions/send-email
 * Body:
 *   - segment: "ALL" | "VIP" | "GOLD" | "SILVER" | "INACTIVE" (required)
 *   - subject: string (required)
 *   - message: string (required) — suporta {{nome}}
 *   - test_only: boolean (opcional) → se true, não envia; só retorna audiência
 */
/**
 * @swagger
 * /api/promotions/send-email:
 *   post:
 *     summary: Enviar e-mail para segmento de clientes
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [segment, subject, message]
 *             properties:
 *               segment: { type: string }
 *               subject: { type: string }
 *               message: { type: string }
 *               test_only: { type: boolean }
 *     responses:
 *       200:
 *         description: Resultado do envio (ou pré-visualização)
 */
router.post("/send-email",
  auth,          // +++ proteger se desejar
  sendLimiter,   // +++ rate limit da rota
  async (req, res) => {
    try {
      const { segment, subject, message, test_only = false } = req.body || {};
      if (!segment) return badReq(res, "segment é obrigatório");
      if (!SEGMENT_KEYS.has(segment)) return badReq(res, "segment inválido"); // +++
      if (!subject || !message) return badReq(res, "subject e message são obrigatórios");

      const audience = await getAudienceBySegment({ segment });

      // +++ retorno rápido se vazio
      if (!audience.length) {
        return ok(res, { segment, total: 0, sent: 0, failed: 0 });
      }

      if (test_only) {
        return ok(res, {
          meta: { total: audience.length, segment },
          sample: audience.slice(0, 20),
        });
      }

      // +++ envio em lotes pra respeitar limites do SMTP (ajuste LOTE se necessário)
      const LOTE = Number.parseInt(process.env.EMAIL_BATCH_SIZE || "50", 10);
      let sent = 0, failed = 0;

      for (let i = 0; i < audience.length; i += LOTE) {
        const chunk = audience.slice(i, i + LOTE);

        const results = await Promise.allSettled(
          chunk.map((cli) => {
            if (!cli.email) { failed++; return Promise.resolve(); }
            const subj = applyTemplate(subject, cli);
            const txt  = applyTemplate(message, cli);
            const html = `<p>${escapeHtml(txt).replace(/\n/g, "<br/>")}</p>`; // +++ escapar

            return sendEmail({ to: cli.email, subject: subj, text: txt, html })
              .then(() => { sent++; })
              .catch(() => { failed++; });
          })
        );

        // (opcional) log por lote
        if (process.env.NODE_ENV !== "production") {
          console.log(`[EMAIL_BATCH] ${i}-${i + chunk.length - 1}`, JSON.stringify(results.map(r => r.status), null, 0));
        }

        // (opcional) pequena pausa entre lotes
        const pauseMs = Number.parseInt(process.env.EMAIL_BATCH_PAUSE_MS || "0", 10);
        if (pauseMs > 0) await new Promise(r => setTimeout(r, pauseMs));
      }

      return ok(res, { segment, total: audience.length, sent, failed });
    } catch (err) {
      return fail(res, err);
    }
  }
);

// ---------- CRUD BASEADO EM BANCO (canônico) ----------

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Listar promoções
 *     tags: [Promotions]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *       - in: query
 *         name: dir
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de promoções com paginação
 */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit ?? "20", 10), 100);
    const offset = Math.max(parseInt(req.query.offset ?? "0", 10), 0);
    const orderBy = ["created_at", "updated_at"].includes(req.query.order)
      ? req.query.order
      : "created_at";
    const dir = req.query.dir === "asc" ? true : false; // ascending

    let query = supabase
      .from("promotions")
      .select("*", { count: "exact" })
      .order(orderBy, { ascending: dir });

    if (offset > 0) query = query.range(offset, offset + limit - 1);
    else query = query.limit(limit);

    const { data, error, count } = await query;
    if (error) return fail(res, error);

    return ok(res, { items: data, meta: { limit, offset, count } });
  } catch (err) {
    return fail(res, err);
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Obter promoção por ID
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promoção encontrada
 *       404:
 *         description: Promoção não encontrada
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id; // se for integer no banco, supabase faz cast
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return notFound(res);
    return ok(res, { item: data });
  } catch (err) {
    return fail(res, err);
  }
});

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Criar promoção
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               type: { type: string }
 *               conditions: { type: string }
 *               active: { type: boolean }
 *               start_date: { type: string, format: date }
 *               end_date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Promoção criada
 */
router.post("/", async (req, res) => {
  try {
    let {
      title,
      description,
      type,
      conditions,
      active = true,
      start_date,
      end_date,
    } = req.body || {};

    // validações mínimas
    if (!title || !description) return badReq(res, "title e description são obrigatórios");
    if (!isISODate(start_date) || !isISODate(end_date))
      return badReq(res, "Datas devem ser ISO válidas (YYYY-MM-DD ou ISO 8601)");
    if (start_date && end_date && new Date(start_date) > new Date(end_date))
      return badReq(res, "start_date não pode ser maior que end_date");

    active = parseBool(active);

    const payload = { title, description, type, conditions, active, start_date, end_date };

    // cria a promoção
    const { data: promo, error: promoErr } = await supabase
      .from("promotions")
      .insert([payload])
      .select()
      .single();

    if (promoErr) return fail(res, promoErr);

    // envia e-mails de teste (opcional por ENV)
    if (process.env.SEND_TEST_EMAILS === "true") {
      const { data: users, error: usersErr } = await supabase
        .from("users")
        .select("email");

      if (usersErr) {
        console.error("[usersErr]", usersErr);
      } else if (users?.length) {
        const results = await Promise.allSettled(
          users.map((u) =>
            sendEmail({
              to: u.email,
              subject: `Nova promoção: ${title}`,
              text: description,
              html: `<h2>${title}</h2><p>${description}</p>`,
            })
          )
        );
        console.log("[EMAIL_TEST_RESULTS]", JSON.stringify(results, null, 2));
      }
    }

    return created(res, { item: promo });
  } catch (err) {
    return fail(res, err);
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Atualizar promoção
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Promoção atualizada
 */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let {
      title,
      description,
      type,
      conditions,
      active,
      start_date,
      end_date,
    } = req.body || {};

    if (start_date && !isISODate(start_date)) return badReq(res, "start_date inválida");
    if (end_date && !isISODate(end_date)) return badReq(res, "end_date inválida");
    if (start_date && end_date && new Date(start_date) > new Date(end_date))
      return badReq(res, "start_date não pode ser maior que end_date");

    const patch = {};
    if (title !== undefined) patch.title = title;
    if (description !== undefined) patch.description = description;
    if (type !== undefined) patch.type = type;
    if (conditions !== undefined) patch.conditions = conditions;
    if (active !== undefined) patch.active = parseBool(active);
    if (start_date !== undefined) patch.start_date = start_date;
    if (end_date !== undefined) patch.end_date = end_date;
    patch.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("promotions")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return notFound(res);
    return ok(res, { item: data });
  } catch (err) {
    return fail(res, err);
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Remover promoção
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promoção removida
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from("promotions")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return notFound(res);
    return ok(res, { message: "Promoção removida", item: data });
  } catch (err) {
    return fail(res, err);
  }
});

// ---------- (Opcional) Endpoints de MOCK ----------
if (process.env.USE_PROMO_MOCK === "true") {
  const mockPromotions = []; // substitua pelo seu mock real

  router.get("/mock", (req, res) => ok(res, { items: mockPromotions }));
  router.get("/mock/:id", (req, res) => {
    const item = mockPromotions.find((p) => String(p.id) === String(req.params.id));
    return item ? ok(res, { item }) : notFound(res);
  });
  router.post("/mock", async (req, res) => {
    const { title, description } = req.body || {};
    if (!title || !description) return badReq(res, "title e description são obrigatórios");
    const newPromo = {
      id: (mockPromotions.length + 1).toString(),
      title,
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockPromotions.push(newPromo);
    return created(res, { item: newPromo });
  });
}

module.exports = router;
