// Validate environment settings before the server opens a port or database connection.
const path = require("node:path");
const { randomBytes } = require("node:crypto");

const root = path.resolve(__dirname, "..");
function loadConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT must be 1–65535");
  if (production && (!env.CSRF_SECRET || env.CSRF_SECRET.length < 64)) {
    throw new Error(
      "Production requires a random CSRF_SECRET of at least 64 characters",
    );
  }
  const proxy = env.TRUST_PROXY || "";
  if (proxy === "true" || /^\d+$/.test(proxy))
    throw new Error(
      "TRUST_PROXY must name trusted proxy IPs/subnets, not true or a hop count",
    );
  return {
    production,
    port,
    host: env.HOST || "127.0.0.1",
    csrfSecret: env.CSRF_SECRET || randomBytes(32).toString("hex"),
    databasePath: path.resolve(
      root,
      env.DATABASE_PATH || "data/messages.sqlite",
    ),
    trustProxy: proxy ? proxy.split(",").map((value) => value.trim()) : false,
  };
}

module.exports = { root, loadConfig };
