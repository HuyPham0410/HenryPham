// Prevent deployment regressions while preserving loopback-only local development.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadConfig } = require("../src/config.js");

test("Render accepts proxy traffic on its assigned port despite a stale local HOST", () => {
  const config = loadConfig({
    RENDER: "true",
    NODE_ENV: "production",
    PORT: "10000",
    HOST: "127.0.0.1",
    CSRF_SECRET: "a".repeat(64),
  });
  assert.equal(config.host, "0.0.0.0");
  assert.equal(config.port, 10000);
});

test("local development stays private and non-Render hosts remain configurable", () => {
  assert.equal(loadConfig({}).host, "127.0.0.1");
  assert.equal(loadConfig({ RENDER: "false" }).host, "127.0.0.1");
  const production = { NODE_ENV: "production", CSRF_SECRET: "a".repeat(64) };
  assert.equal(loadConfig(production).host, "0.0.0.0");
  assert.equal(loadConfig({ ...production, HOST: "127.0.0.1" }).host, "127.0.0.1");
});

test("Render configuration still rejects missing production secrets and invalid ports", () => {
  assert.throws(() => loadConfig({ RENDER: "true", NODE_ENV: "production" }), /CSRF_SECRET/);
  assert.throws(() => loadConfig({ RENDER: "true", PORT: "invalid" }), /PORT/);
});
