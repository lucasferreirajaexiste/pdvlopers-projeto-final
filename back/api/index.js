// Vercel Serverless entry (moved inside back/): require the Express app at invocation time.
// This avoids crashing the function during module import if dependencies
// are missing or an init error occurs. Instead we return a 500 with
// the error details (visible in Vercel function logs).
module.exports = async function handler(req, res) {
  let app;
  try {
    app = require("../src/index");
  } catch (err) {
    console.error("Failed to import backend app:", err);
    res.status(500).json({
      error: "Server import failed",
      message: err && err.message ? err.message : String(err),
    });
    return;
  }

  try {
    // If Vercel mounted this function at the /api prefix, the incoming
    // request URL may include that prefix (e.g. /api/api-docs). The
    // Express app in `back/src` registers routes like `/api-docs` and
    // `/health`, so strip a single leading `/api` segment if present.
    // Preserve query string if present.
    try {
      const rawUrl = req.url || "";
      const [pathPart, qs] = rawUrl.split("?");

      let newPath = null;
      if (pathPart === "/api") {
        newPath = "/";
      } else if (pathPart.startsWith("/api/api-docs")) {
        newPath = pathPart.replace("/api/api-docs", "/api-docs");
      } else if (pathPart === "/api/api-docs.json") {
        newPath = "/api-docs.json";
      }

      if (newPath != null) {
        const newUrl = qs ? `${newPath}?${qs}` : newPath;
        req.url = newUrl;
        req.originalUrl = newUrl;
        if (req._parsedUrl) {
          req._parsedUrl = undefined;
        }
      }
    } catch (e) {
      console.warn(
        "Failed to normalize request URL for express:",
        e && e.message,
      );
    }

    return app(req, res);
  } catch (err) {
    console.error("Error while handling request with Express app:", err);
    res.status(500).json({ error: "Handler error", message: err.message });
  }
};
