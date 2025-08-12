// Pacote dotenv e função config()
import 'dotenv/config';
// Framework express
import express from 'express';
// Pacote de Segurança
import  cors from 'cors';
// Endpoints do módulo financeiro
import financialRoutes from './src/routes/financialRoutes.js';

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