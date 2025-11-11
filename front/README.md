# 🛒 Mercadinho VIP - Backend API

API REST para o sistema de gestão de fidelidade, promoções e operações de pequenos mercadinhos, desenvolvida em **Node.js** com **Express.js** e **Supabase**.

---

## 🚀 Tecnologias

- **Node.js** & **Express.js** – Backend e rotas
- **Supabase** – Banco de dados PostgreSQL
- **JWT** – Autenticação
- **BcryptJS** – Hash de senhas
- **Swagger** – Documentação da API
- **Docker** – Containerização
- **Jest** – Testes automatizados
- **Speakeasy** & **QRCode** – 2FA (autenticação em dois fatores)
- **Nodemailer** (mock) – Envio de e-mails

---

## 👥 Equipe Backend

| Desenvolvedor    | Responsabilidade                | Arquivos Principais                                      |
|------------------|---------------------------------|----------------------------------------------------------|
| **Geraldo**      | Autenticação & Segurança        | `src/routes/authRoutes.js`, `src/middleware/authMiddleware.js` |
| **Fabio N.**     | Gestão de Clientes              | `src/routes/clientRoutes.js`, `src/models/Client.js`     |
| **Felipe F.**    | Controle de Fidelidade          | `src/routes/loyaltyRoutes.js`, `src/models/LoyaltyTransaction.js` |
| **João Jacques** | Promoções & Comunicação         | `src/routes/promotionRoutes.js`, `src/models/Promotion.js` |
| **Helen**        | Financeiro                      | `src/routes/financialRoutes.js`, `src/models/FinancialTransaction.js` |
| **Jose Felipe**  | Infraestrutura & Documentação   | `Dockerfile`, `docker-compose.yml`, `.github/workflows/` |

---

## ⚙️ Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (opcional)

### Passos

1. **Clone o repositório**
    ```bash
    git clone <repository-url>
    cd mercadinho-vip-backend
    ```

2. **Instale as dependências**
    ```bash
    npm install
    ```

3. **Configure as variáveis de ambiente**
    ```bash
    cp .env.example .env
    # Edite o arquivo .env conforme necessário
    ```

4. **Execute as migrações do banco**
    ```bash
    # Execute os arquivos SQL em database/migrations/ no Supabase
    ```

5. **Inicie o servidor**
    ```bash
    npm run dev
    ```

---

## 🐳 Docker

```bash
# Build da imagem
npm run docker:build

# Executar com Docker Compose
docker-compose up -d
```

---

## 📚 Documentação

A documentação da API está disponível em:
- **Desenvolvimento**: http://localhost:3000/api-docs
- **Produção**: https://api.mercadinhovip.com/api-docs

### Swagger JSON

Além da UI, o JSON OpenAPI também está disponível em:

- http://localhost:3000/api-docs.json

Se a UI do Swagger não carregar por conta de políticas de segurança do Helmet (CSP), desative temporariamente o CSP no `server.js`:

```js
// app.use(helmet({ contentSecurityPolicy: false }))
```

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

---

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configurações (database, swagger)
├── middleware/      # Middlewares (auth, validation, error)
├── models/          # Modelos de dados
├── routes/          # Rotas da API
├── utils/           # Utilitários e helpers
└── server.js        # Arquivo principal

database/
├── migrations/      # Migrações do banco
└── seeds/           # Dados iniciais

tests/               # Testes automatizados
```

---

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer <seu-jwt-token>
```

- Suporte a 2FA (Two-Factor Authentication) via QR Code e OTP.
- Fluxo de recuperação de senha via e-mail (mock).

---

## 🛣️ Endpoints principais

- `POST /api/auth/register` – Cadastro de usuário
- `POST /api/auth/login` – Login de usuário
- `POST /api/auth/forgot-password` – Recuperação de senha
- `POST /api/auth/refresh` – Renovar token JWT
- `GET /api/auth/2fa/generate` – Gerar QR Code para 2FA
- `POST /api/auth/2fa/verify` – Verificar token 2FA
- `GET /api/auth/me` – Dados do usuário autenticado (rota protegida)

---

## 📊 Monitoramento

- **Health Check**: `GET /health`
- **Logs**: Disponíveis em `logs/`
- **Métricas**: Implementação futura (Prometheus)

---

## 🚀 Deploy

Deploy automatizado via GitHub Actions:
- **Staging**: Branch `develop`
- **Produção**: Branch `main`

---

## 📝 Contribuição

1. Crie uma branch: `git checkout -b feature/nome-da-feature`
2. Commit: `git commit -m 'Add: nova feature'`
3. Push: `git push origin feature/nome-da-feature`
4. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe backend.
