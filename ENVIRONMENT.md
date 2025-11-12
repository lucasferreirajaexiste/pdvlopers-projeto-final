# 🌱 Variáveis de ambiente (Deploy Vercel)

Use este guia para popular as envs no Vercel (Production/Preview/Development) tanto para o backend (`/back`) quanto para o frontend (`/front`). Todos os nomes abaixo são *case sensitive*.

## Backend (`back/`)

| Variável | Descrição | Exemplo / Valor atual |
| --- | --- | --- |
| `NODE_ENV` | Ambiente padrão | `production` |
| `PORT` | Porta interna (Vercel ignora, mas mantenha) | `3000` |
| `APP_NAME` | Nome exibido em logs | `Mercadinho VIP` |
| `FRONTEND_URL` | Lista de origens permitidas no CORS, separadas por vírgula | `http://localhost:5173,https://balcao-two.vercel.app` |
| `API_KEYS` | Lista de chaves aceita pelo middleware `x-api-key` | `4eTx9xR3ax7yeajGP6vQimdeBNx7X0cNlfHW4yIYbvQ` |
| `API_KEY_HEADER` / `API_KEY_QUERY` | Nome do header e query aceitos (opcional) | `x-api-key` / `api_key` |
| `SUPABASE_URL` | URL do projeto Supabase | `https://czjdhvdprgvkhnooeuxq.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role (permite CRUD completo) | `eyJh...HOI8Vk` |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Segredos dos tokens | `sua_chave_supersecreta...` |
| `JWT_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | TTL dos tokens | `1h` / `7d` |
| `SMTP_*` | Configuração do transporte Nodemailer | (usar dados do Gmail/app password) |
| `SEND_TEST_EMAILS` | Força envio “fake” para debug | `true` |
| `SWAGGER_ENABLE` | Habilita UI mesmo em produção | `true` |
| `SWAGGER_SERVER_URL` | URL mostrada na seção *Servers* do Swagger | `https://pdvlopers-projeto-final-sigma.vercel.app/` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` | Limite global aplicado via `express-rate-limit` | `900000` / `100` |
| `TRANSACTION_TYPE_DB_VALUES` | Enum usado no finance controller | `entrada,saida` |
| `LOYALTY_*`, `EMAIL_BATCH_*`, `USE_PROMO_MOCK` | Ajustes finos de promoções/fidelidade | ver `.env.example` |

> **Importante:** coloque o mesmo valor de `API_KEYS` na env do frontend (`VITE_API_KEY`). Sem isso o middleware `x-api-key` bloqueia os requests.

## Frontend (`front/`)

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base **sem** `/api` (o código adiciona /api automaticamente) | `https://pdvlopers-projeto-final-sigma.vercel.app` |
| `VITE_API_KEY` | Mesmo valor configurado em `API_KEYS` no backend | `4eTx9xR3ax7yeajGP6vQimdeBNx7X0cNlfHW4yIYbvQ` |

> Nas pré-visualizações do Vercel (Preview), você pode apontar `VITE_API_URL` para o mesmo backend de produção ou para outro workspace — basta garantir que o domínio esteja listado em `FRONTEND_URL` no backend.

## Passo a passo no Vercel

1. Acesse o dashboard do projeto → **Settings → Environment Variables**.
2. Cadastre todas as chaves da tabela, encurtando apenas onde desejar (por exemplo, pode deixar `API_KEY_HEADER`/`API_KEY_QUERY` com os padrões).
3. Clique em **Save**. O Vercel solicitará um redeploy para que os valores sejam aplicados.
4. Em **Deployments**, escolha **Redeploy** (ou faça um novo push) tanto no backend quanto no frontend.

Pronto: com as variáveis sincronizadas, o CORS libera `https://balcao-two.vercel.app`, o middleware `x-api-key` aceita o header e o front consegue autenticar normalmente.
