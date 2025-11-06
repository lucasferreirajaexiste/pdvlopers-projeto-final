const supabase = require('../config/database');

class UserModel {
  // Criar novo usuário
  static async create(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: userData.name,
            email: userData.email,
            password: userData.password
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar usuário
  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Listar todos os usuários (para admin)
  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;