// src/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const swaggerSetup = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Helpers ----------
function tryRequire(...paths) {
  for (const p of paths) {
    try {
      return require(p);
    } catch (e) {
      // se for outro erro que não seja "módulo não encontrado", mostre
      if (e.code !== "MODULE_NOT_FOUND") {
        console.warn(`[routes] Falha carregando ${p}:`, e.message);
      }
    }
  }
  return null; // não achou nenhum
}
const unwrapDefault = (m) => (m && m.__esModule && m.default ? m.default : m);

// ---------- Segurança / Infra ----------
app.use(helmet()); // se o Swagger reclamar de CSP: helmet({ contentSecurityPolicy: false })
app.use(compression());

// CORS (múltiplas origens via FRONTEND_URL=dom1,dom2)
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3001")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Rate limiting global
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || `${15 * 60 * 1000}`, 10),
  max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  message: "Muitas requisições, tente novamente mais tarde.",
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------- Swagger ----------
// Monta a UI em /api-docs e expõe /api-docs.json
// Se o Helmet bloquear a UI por causa de Content-Security-Policy, ajuste:
// app.use(helmet({ contentSecurityPolicy: false }))
if (swaggerSetup && typeof swaggerSetup.setup === "function") {
  swaggerSetup.setup(app, "/api-docs");
} else if (typeof swaggerSetup === "function") {
  // compatibilidade com versão antiga
  swaggerSetup(app);
}

// ---------- Health / Root ----------
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get("/", (_req, res) => {
  res.send("API está no ar! Consulte /health e /api-docs para detalhes.");
});

// ---------- Rotas ----------
const authRoutes = require("./routes/authRoutes");
const loyaltyRoutes = require("./routes/loyaltyRoutes");
const promotionRoutes = require("./routes/promotionRoutes");

// Clients (compat: clientRoutes OU clienteRoutes)
const clientRoutes = tryRequire("./routes/clientRoutes", "./routes/clienteRoutes");
if (!clientRoutes) {
  console.warn("[boot] Rotas de clientes não encontradas (clientRoutes/clienteRoutes).");
} else {
  app.use("/api/clients", clientRoutes); // canônico
  app.use("/clientes", clientRoutes);    // compat
}

app.use("/api/auth", authRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/promotions", promotionRoutes);

// Financial (carrega se existir em algum dos caminhos)
const financialModule = tryRequire(
  "./routes/financialRoutes",       // CJS padrão do seu projeto
  "./routes/FinancialRoutes",       // PascalCase
  "./src/routes/FinancialRoutes",   // caso tenha vindo de outro server
  "../src/routes/FinancialRoutes"
);
if (!financialModule) {
  console.warn("[boot] Rotas financeiras não encontradas. Pulei /api/financial e /api/finance.");
} else {
  const financialRoutes = unwrapDefault(financialModule);
  app.use("/api/financial", financialRoutes);
  app.use("/api/finance", financialRoutes); // compat com branch back5financeiro
}

// ---------- Erros ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
