# 🛒 Mercadinho VIP - Back-end

Projeto de conclusão do curso: **Sistema de Gestão com Fidelidade e Promoções para pequenos mercadinhos**.

Este repositório contém o código do **back-end** em Node.js com Express.js, responsável pela autenticação, segurança e demais serviços de API do sistema.

---

## 📌 Funcionalidades do Back-end

- Registro de usuários com senha criptografada
- Login com emissão de token JWT
- Middleware de autenticação para rotas protegidas
- Fluxo de recuperação de senha (link com validade)
- 2FA opcional com OTP (One-Time Password) via QR Code
- Refresh Token básico

---

## ⚙️ Tecnologias

- Node.js
- Express.js
- JWT (jsonwebtoken)
- BcryptJS (hash de senhas)
- Speakeasy + QRCode (para 2FA)
- Dotenv
- Nodemailer (mock para envio de email)
- Nodemon (dev)

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/mercadinho-vip-backend.git
   cd mercadinho-vip-backend

2. Instale as dependências:

    ```bash
    npm install

3. Configure as variáveis de ambiente:
    Crie um arquivo .env na raiz do projeto e adicione:

    ```env
    JWT_SECRET=sua_chave_supersecreta
    JWT_EXPIRES_IN=1h

4. Inicie o servidor em ambiente de desenvolvimento: 

    ```bash
    npm run dev

O servidor ficará disponível em https://localhost:3000.

.

🛣️ Endpoints principais
POST /api/auth/register: cadastro de usuário

POST /api/auth/login: login de usuário

POST /api/auth/forgot-password: envio de link de recuperação de senha

POST /api/auth/refresh: renovar token JWT

GET /api/auth/2fa/generate: gerar QR Code para 2FA

POST /api/auth/2fa/verify: verificar token 2FA

GET /api/auth/me: obter dados do usuário autenticado (rota protegida)

