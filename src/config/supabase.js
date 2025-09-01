const { createClient } = require('@supabase/supabase-js');

// Configuração do cliente Supabase
const supabaseUrl = 'https://czjdhvdprgvkhnooeuxq.supabase.co/' ;
const supabaseServiceKey = process.env.SUPABASE_KEY; // Use service key para operações admin

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL e Service Key são obrigatórios no arquivo .env');
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;