// src/config/database.js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL não configurada");
}
if (!serviceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_SERVICE_KEY) não configurada");
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

module.exports = supabase;
