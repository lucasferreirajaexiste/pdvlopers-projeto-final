// Importa função para estabelecer conexão
import { createClient } from "@supabase/supabase-js";

// Usando Credenciais
const supabaseUrl = process.env.SUPABASE_URL;
const supabasekey = process.env.SUPABASE_KEY;
// Executa a função
const supabase = createClient(supabaseUrl, supabasekey)

// Exporta o cliente supabase
export default supabase;