const supabase = require("../config/database");

// CREATE
exports.createCliente = async (clienteData) => {
  const payload = {
    nome: clienteData.nome,
    cpf: clienteData.cpf,
    endereco: clienteData.endereco ?? null,
    data_nascimento: clienteData.data_nascimento ?? null,
    email: clienteData.email ?? null,
    telefone: clienteData.telefone ?? null,
  };

  const { data, error } = await supabase
    .from("clientes")
    .insert([payload])
    .select()
    .single();

  if (error) {
    if (error.code === "23505" || /duplicate key/i.test(error.message || "")) {
      return { success: false, message: "CPF já cadastrado no sistema." };
    }
    throw error;
  }

  return { success: true, cliente: data };
};

// READ (all)
exports.findAllClientes = async () => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data || [];
};

// READ (by id)
exports.findClienteById = async (id) => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw error;
  }
  return data;
};

// UPDATE
exports.updateCliente = async (id, clienteData) => {
  const patch = {
    nome: clienteData.nome,
    cpf: clienteData.cpf,
    endereco: clienteData.endereco,
    data_nascimento: clienteData.data_nascimento,
    email: clienteData.email,
    telefone: clienteData.telefone,
    updated_at: new Date().toISOString(),
  };

  Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

  const { data, error } = await supabase
    .from("clientes")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// DELETE
exports.deleteCliente = async (id) => {
  const { data, error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    if (error.code === "PGRST116") return 0;
    throw error;
  }
  return data ? 1 : 0;
};
