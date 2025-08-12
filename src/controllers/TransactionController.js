// Resgatando o Supabase
import supabase from "../services/Supabase";

// Criando uma nova transação
export const createTransaction = async (req, res) => {
    // Capta as requisições do front
    const { description, amount, type, transaction_date, category_id } = req.body;

    // Validação Básica
    if (!description || !amount || !type || !transaction_date) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

}