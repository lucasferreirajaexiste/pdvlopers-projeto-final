/**
 * API Key middleware factory.
 * Accepts a list of valid keys and optional configuration.
 *
 * options:
 *  - headerName: header to inspect (default: x-api-key)
 *  - queryParam: fallback query param (default: api_key)
 *  - skip: (req) => boolean to bypass protection for specific requests
 */
module.exports = function createApiKeyMiddleware(options = {}) {
  const {
    keys = [],
    headerName = "x-api-key",
    queryParam = "api_key",
    skip = () => false,
  } = options;

  const trimmedKeys = (Array.isArray(keys) ? keys : [keys])
    .map((k) => (typeof k === "string" ? k.trim() : ""))
    .filter(Boolean);

  const allowedKeys = new Set(trimmedKeys);

  if (!allowedKeys.size) {
    throw new Error("apiKeyMiddleware requires at least one API key.");
  }

  const normalizedHeader = headerName.toLowerCase();

  return function apiKeyGuard(req, res, next) {
    try {
      if (skip(req)) {
        return next();
      }

      const headerValue =
        req.get(headerName) ||
        req.get(normalizedHeader) ||
        req.headers[headerName] ||
        req.headers[normalizedHeader];

      const candidateKey =
        headerValue ||
        (queryParam
          ? (req.query?.[queryParam] ?? req.query?.[queryParam.toLowerCase()])
          : null);

      if (!candidateKey) {
        console.warn(
          "[apiKeyMiddleware] request missing API key",
          req.method,
          req.originalUrl,
        );
        return res.status(401).json({ error: "API key is required." });
      }

      if (!allowedKeys.has(String(candidateKey).trim())) {
        console.warn(
          "[apiKeyMiddleware] invalid API key",
          req.method,
          req.originalUrl,
        );
        return res.status(401).json({ error: "Invalid API key." });
      }

      return next();
    } catch (err) {
      console.error("[apiKeyMiddleware] unexpected error", err);
      return res.status(500).json({ error: "API key validation failed." });
    }
  };
};
