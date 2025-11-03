export const financialTransactionSchema = {
  id: "string (BIGINT as string)",
  type: "enum ('entrada', 'saida')",
  categoryId: "number | null (BIGINT)",
  amount: "number (2 decimals) | string (if returned as NUMERIC string)",
  description: "string",
  date: "string (YYYY-MM-DD)",
  createdAt: "string (ISO timestamp)",
  updatedAt: "string (ISO timestamp) | undefined",
};

export default financialTransactionSchema;