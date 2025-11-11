// Modelo de transação de fidelidade (Back 3 - Felipe F.)
const loyaltyTransactionSchema = {
  id: "uuid",
  client_id: "uuid (foreign key)",
  type: "enum (earn, redeem)",
  points: "integer",
  amount: "decimal",
  description: "string",
  reward_id: "uuid (foreign key, nullable)",
  created_at: "timestamp",
}

module.exports = { loyaltyTransactionSchema }
