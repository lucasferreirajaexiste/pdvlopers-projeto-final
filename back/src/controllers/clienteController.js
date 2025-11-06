// Importa os serviços que vamos utilizar
const ClientsService = require("../services/clients.service");

// Controlador para criar um novo cliente
exports.createCliente = async (req, res) => {
  try {
    // req.body contém os dados enviados no corpo da requisição POST
    const result = await clienteService.createCliente(req.body);

    if (result.success) {
      // 201 Created: Requisição bem sucedida e um novo recurso foi criado.
      res.status(201).json({ message: 'Cliente criado com sucesso!', cliente: result.cliente });
    } else {
      // 400 Bad Request: O servidor não pode processar a requisição devido a um erro do cliente (CPF duplicado).
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    // 500 Internal Server Error: Um erro inesperado aconteceu no servidor.
    res.status(500).json({ message: 'Erro ao criar cliente.', error: error.message });
  }
};

// Controlador para listar todos os clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await clienteService.findAllClientes();
    // 200 OK: Resposta padrão para requisições bem sucedidas.
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes.', error: error.message });
  }
};

// Controlador para buscar um cliente pelo ID
exports.getClienteById = async (req, res) => {
  try {
    // req.params.id contém os parâmetros da rota (ex: /clientes/123)
    const cliente = await clienteService.findClienteById(req.params.id);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      // 404 Not Found: O recurso solicitado não foi encontrado.
      res.status(404).json({ message: 'Cliente não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente.', error: error.message });
  }
};

// Controlador para atualizar um cliente
exports.updateCliente = async (req, res) => {
  try {
    const clienteAtualizado = await clienteService.updateCliente(req.params.id, req.body);
    if (clienteAtualizado) {
      res.status(200).json({ message: 'Cliente atualizado com sucesso!', cliente: clienteAtualizado });
    } else {
      res.status(404).json({ message: 'Cliente não encontrado para atualização.' });
    }
  } catch (error) {
    // Adicionamos a mesma verificação do CPF duplicado para o caso de uma atualização
    if (error.code === '23505') {
        res.status(400).json({ message: 'CPF já cadastrado no sistema.' });
    } else {
        res.status(500).json({ message: 'Erro ao atualizar cliente.', error: error.message });
    }
  }
};

// Controlador para deletar um cliente
exports.deleteCliente = async (req, res) => {
  try {
    const deletedCount = await clienteService.deleteCliente(req.params.id);
    if (deletedCount > 0) {
      // 204 No Content: O servidor processou a requisição com sucesso e não há conteúdo para retornar.
      // É comum não enviar corpo na resposta 204, por isso usamos .send() vazio.
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Cliente não encontrado para deleção.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar cliente.', error: error.message });
  }
};