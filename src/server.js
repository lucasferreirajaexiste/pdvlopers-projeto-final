const express = require('express');
const app = express();

// Importa a configuração do .env para o projeto
// Garanta que você tem o 'require('dotenv').config()' se estiver usando no database.js
// Se não, pode ser bom ter aqui também, no topo de tudo.
require('dotenv').config(); 

const port = process.env.PORT || 3000;

// Importa as rotas de clientes com o caminho correto
const clienteRoutes = require('./routes/clienteRoutes');

// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());

// Middleware para o Express entender dados de formulários (menos comum para APIs REST)
app.use(express.urlencoded({ extended: true }));

// Rota principal da aplicação para teste
app.get('/', (req, res) => {
  res.send('API de Gestão de Clientes está no ar e funcionando!');
});

// Usa as rotas de clientes com o prefixo /clientes
// Qualquer requisição para /clientes será direcionada para o 'clienteRoutes'
app.use('/clientes', clienteRoutes);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});