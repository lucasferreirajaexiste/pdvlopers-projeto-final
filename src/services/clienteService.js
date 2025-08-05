// Importa a nossa configuração de conexão com o banco de dados
const db = require('../config/database');

// Função para criar um novo cliente
exports.createCliente = async (clienteData) => {
  const { nome, cpf, endereco, data_nascimento, email, telefone } = clienteData;
  try {
    // A cláusula RETURNING * faz com que o PostgreSQL retorne os dados do cliente inserido.
    const result = await db.query(
      'INSERT INTO clientes (nome, cpf, endereco, data_nascimento, email, telefone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, cpf, endereco, data_nascimento, email, telefone]
    );
    return { success: true, cliente: result.rows[0] };
  } catch (error) {
    // O código '23505' é o erro padrão do PostgreSQL para violação de constraint de unicidade.
    if (error.code === '23505') {
      return { success: false, message: 'CPF já cadastrado no sistema.' };
    }
    // Para outros erros, nós os relançamos para serem tratados pelo controller.
    throw error;
  }
};

// Função para buscar todos os clientes
exports.findAllClientes = async () => {
  const result = await db.query('SELECT * FROM clientes ORDER BY nome ASC');
  return result.rows;
};

// Função para buscar um cliente pelo seu ID
exports.findClienteById = async (id) => {
  const result = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
  // Retorna o primeiro cliente encontrado, ou null se não encontrar nenhum.
  return result.rows[0];
};

// Função para atualizar os dados de um cliente
exports.updateCliente = async (id, clienteData) => {
  const { nome, cpf, endereco, data_nascimento, email, telefone } = clienteData;
  const result = await db.query(
    'UPDATE clientes SET nome = $1, cpf = $2, endereco = $3, data_nascimento = $4, email = $5, telefone = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
    [nome, cpf, endereco, data_nascimento, email, telefone, id]
  );
  return result.rows[0];
};

// Função para deletar um cliente
exports.deleteCliente = async (id) => {
  // O result.rowCount informará quantas linhas foram afetadas (deletadas).
  const result = await db.query('DELETE FROM clientes WHERE id = $1', [id]);
  return result.rowCount; // Retorna 1 se deletou com sucesso, 0 se não encontrou o cliente.
};