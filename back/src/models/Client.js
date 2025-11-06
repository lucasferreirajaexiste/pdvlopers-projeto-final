// Modelo de cliente para referência (Back 2 - Fabio N.)
const clientSchema = {
  id: "uuid",
  name: "string",
  cpf: "string (unique)",
  email: "string",
  phone: "string",
  birth_date: "date",
  address: "jsonb",
  points_balance: "integer (default: 0)",
  total_spent: "decimal (default: 0)",
  created_at: "timestamp",
  updated_at: "timestamp",
}

module.exports = { clientSchema }
