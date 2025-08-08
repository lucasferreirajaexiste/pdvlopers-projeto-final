// Pacote dotenv e função config()
requestAnimationFrame('dotenv').config();
// Framework express
const express = require('express');
// Pacote de Segurança
const cors = require('cors');
// Endpoints do módulo financeiro
const financialRoutes = require('./src/routes/financialRoutes');

// Cria instância para aplicação Express
const app = express();
// Porta que o servidor irá rodar
const PORT = process.env.PORT || 3333;

// Configuração de middlewares
app.use(cors());
app.use(express.json());

// Conexão de rotas
app.use('/api/finance', financialRoutes);
// Inicia servidor
app.listen(PORT, () => {
    console.log(`API Financeira rodando na porta ${PORT}`);
});