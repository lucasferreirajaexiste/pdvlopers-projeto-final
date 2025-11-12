const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const isProduction = process.env.NODE_ENV === "production";
const localPort = process.env.PORT || 3000;
const swaggerServerUrl =
  process.env.SWAGGER_SERVER_URL ||
  (isProduction ? "/" : `http://localhost:${localPort}`);

const sourceRoot = path.resolve(__dirname, "..");
const apiGlobs = [
  path.join(sourceRoot, "routes", "**/*.js"),
  path.join(sourceRoot, "controllers", "**/*.js"),
  path.join(sourceRoot, "middleware", "**/*.js"),
];

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Fidelidade API",
      version: "1.0.0",
      description: "API para sistema de fidelidade de clientes",
      contact: {
        name: "Equipe Backend",
        email: "backend@fidelidade.com",
      },
    },
    servers: [
      {
        url: swaggerServerUrl,
        description: isProduction ? "Produção" : "Desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description:
            "Use the API key configured via API_KEYS / API_KEY environment variable.",
        },
      },
    },
    // aplica security globalmente (padrão para rotas que precisem de auth)
    security: [
      {
        bearerAuth: [],
      },
      {
        apiKeyAuth: [],
      },
    ],
  },
  // Use um caminho absoluto baseado no arquivo atual para garantir que o Vercel
  // bundle encontre os arquivos mesmo quando o cwd muda.
  apis: apiGlobs,
};

const specs = swaggerJsdoc(options);

// Expose a small helper to mount Swagger UI and the raw JSON
module.exports = {
  setup: (app, mountPath = "/api-docs") => {
    app.use(
      mountPath,
      swaggerUi.serve,
      swaggerUi.setup(specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
      }),
    );

    // Raw JSON spec (útil para CI, gateways ou exportação automática)
    app.get(`${mountPath}.json`, (_req, res) => res.json(specs));
  },
  specs,
  options,
};
