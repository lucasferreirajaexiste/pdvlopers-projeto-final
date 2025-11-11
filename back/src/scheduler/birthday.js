const cron = require("node-cron");
const fetch = require("node-fetch");

const BASE = process.env.API_BASE || "http://localhost:3000";

cron.schedule("0 9 * * *", async () => {
  try {
    const res = await fetch(`${BASE}/api/promotions/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        segment: "BIRTHDAY_TODAY",
        subject: "Feliz aniversário, {{nome}}! 🎂",
        message: "Passe hoje na loja e ganhe 10% OFF com o cupom ANIVER10.",
      }),
    });
    const data = await res.json();
    console.log("[BIRTHDAY JOB] Resultado:", data);
  } catch (err) {
    console.error("[BIRTHDAY JOB] ERRO:", err.message);
  }
}, { timezone: "America/Sao_Paulo" });

console.log("🎉 Scheduler de aniversário iniciado...");
