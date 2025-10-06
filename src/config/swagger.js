const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

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
        url:
          process.env.NODE_ENV === "production"
            ? "https://api.fidelidade.com"
            : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === "production" ? "Produção" : "Desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // aplica security globalmente (padrão para rotas que precisem de auth)
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Use um padrão mais abrangente para capturar rotas e modelos em subpastas
  apis: ["./src/**/*.js"],
}

const specs = swaggerJsdoc(options)

// Expose a small helper to mount Swagger UI and the raw JSON
module.exports = {
  setup: (app, mountPath = "/api-docs") => {
    app.use(mountPath, swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
    }))

    // Raw JSON spec (útil para CI, gateways ou exportação automática)
    app.get(`${mountPath}.json`, (_req, res) => res.json(specs))
  },
  specs,
  options,
}
