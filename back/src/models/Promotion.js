// Modelo de promoção (Back 4 - João Jacques)
const promotionSchema = {
  id: "uuid",
  title: "string",
  description: "text",
  type: "enum (birthday, points_based, general)",
  conditions: "jsonb",
  active: "boolean",
  start_date: "date",
  end_date: "date",
  created_at: "timestamp",
  updated_at: "timestamp",
}

module.exports = { promotionSchema }
