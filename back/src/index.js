// Vercel entry point — export the real Express app from server.js
// Do NOT call app.listen() here; Vercel (and other serverless platforms)
// will invoke the exported app directly.
const app = require("./server");

module.exports = app;
