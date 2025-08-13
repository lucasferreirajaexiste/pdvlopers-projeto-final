/**
 * CRUD - Transações
 */

// Resgatando o Supabase
import supabase from "../services/Supabase";

// Criação de transações
export const createTransaction = async (req, res) => {
    // Capta as requisições do front
    const { description, amount, type, transaction_date, category_id } = req.body;

    // Validação Básica
    if (!description || !amount || !type || !transaction_date) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }
  
  try{
    const { data, error} = await supabase
      .from ('transactions')
      .insert([{ description, amount, type, transaction_date, category_id }])
      .select()
      .single(); // Retorna o objeto direto

      if(error){
        // Lança erro para ser captado pelo bloco de tratamento de exceção
        throw error;
      }
      // Se ocorrer tudo ok, retornará o status 201 e o dado da nova transação
      res.status(201).json(data);
  } catch (error){
    res.status(500).json({ error: error.message })
  }
};

// Obter todas as transações com filtro
export const getTransactions = async (req, res) => {
  try{
    const { category_id, type } = req.query; // Filtros da URL

    let query = supabase.from('transactions').select(`
      id,
      description,
      amount,
      type,
      transaction_date,
      category:categories (name)`
    );

    // Se filtros existirem, serão aplicados
    if (category_id) query = query.eq('category_id', category_id);
    if (type) query = query.eq('type', type);

    // Executa a consulta, ordenando pela data mais recente
    const { data, error } = await query.order('transaction_date', { ascending: false });

    if (error){
      throw error;
    }

    res.status(200).json(data);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
};

// Atualização da transação existente
export const updateTransaction = async (req, res) => {
  try{
    const { id } = req.params; // Capta o ID da transação pela URL 
    const { description, amount, type, transaction_date, category_id } = req.body;

    // Validação para garantir que o ID foi fornecido
    if(!id) {
      return res.status(400).json({ error: 'O ID da transação é obrigatório.' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ description, amount, type, transaction_date, category_id })
      .eq('id', id)
      .select()
      .single();
      
    if (error){
      throw error;
    }

    // Se não ouver retorno significa que a transação com o ID não existe
    if(!data){
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    res.status(200).json(data); // Retorna a transação atualizada
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

// Deletando uma transação
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da transação pela URL

    // Validação para garantir que o ID foi fornecido
    if(!id) {
      return res.status(400).json({ error: 'O ID da transação é obrigatório.' });
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id); 

      if(error){
        throw error;
      }
      // Status 204 é a resposta padrão para uma deleção bem-sucedida.      
      res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};