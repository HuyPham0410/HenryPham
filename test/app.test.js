// Exercise public routes, form submission, persistence, and security boundaries using isolated test data.
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { createApp } = require("../src/app.js");
const { loadConfig } = require("../src/config.js");
const {
  ContactRepository,
} = require("../src/repositories/ContactRepository.js");
const {
  ContactService,
  ValidationError,
} = require("../src/services/ContactService.js");

function fixture(t, production = false) {
  const repository = new ContactRepository(":memory:");
  t.after(() => repository.close());
  const config = loadConfig({
    NODE_ENV: production ? "production" : "test",
    CSRF_SECRET: "a".repeat(64),
  });
  const app = createApp({ config, repository });
  return { app, repository, agent: request.agent(app) };
}
async function token(agent) {
  const page = await agent.get("/contact").expect(200);
  return page.text.match(/name="_csrf" value="([^"]+)"/)[1];
}
const valid = {
  name: "Henry Pham",
  email: "henry@example.com",
  message: "Hello, this is a test message.",
};

test("CV pages expose verified content and local assets without stale student claims", async (t) => {
  const { app } = fixture(t);
  const home = await request(app).get("/").expect(200);
  assert.match(home.text, /Computer Science graduate/i);
  assert.match(home.text, /May 2026/);
  const resume = await request(app).get("/resume").expect(200);
  assert.match(resume.text, /3\.66/);
  assert.match(resume.text, /Huy-Pham-CV\.pdf/);
  const work = await request(app).get("/work").expect(200);
  for (const title of [
    "NiceFit",
    "Email Classification",
    "Federated Learning for Healthcare",
  ])
    assert.ok(work.text.includes(title));
  await request(app)
    .get("/assets/vendor/bootstrap/bootstrap.min.css")
    .expect(200)
    .expect("Content-Type", /css/);
  await request(app)
    .get("/assets/documents/Huy-Pham-CV.pdf")
    .expect(200)
    .expect("Content-Type", /pdf/);
});

test("pages, old URLs, static assets and private paths", async (t) => {
  const { app } = fixture(t);
  for (const url of ["/", "/work", "/contact"]) {
    const response = await request(app).get(url).expect(200);
    assert.equal((response.text.match(/<!doctype html>/gi) || []).length, 1);
    assert.ok(
      response.headers["content-security-policy"].includes("script-src 'self'"),
    );
    assert.equal(response.headers["x-powered-by"], undefined);
  }
  for (const [old, current] of [
    ["/index.html", "/"],
    ["/work.html", "/work"],
    ["/contact.html", "/contact"],
  ]) {
    await request(app).get(old).expect(301).expect("Location", current);
  }
  await request(app).get("/assets/css/site.css").expect(200);
  await request(app).get("/assets/images/portrait.jpg").expect(200);
  for (const url of [
    "/.env",
    "/src/server.js",
    "/data/messages.sqlite",
    "/missing",
  ])
    await request(app).get(url).expect(404);
});
test("valid form persists once, redirects, and refresh does not insert again", async (t) => {
  const { agent, repository } = fixture(t);
  const _csrf = await token(agent);
  await agent
    .post("/contact")
    .type("form")
    .send({ ...valid, _csrf })
    .expect(303)
    .expect("Location", "/contact/success");
  await agent.get("/contact/success").expect(200);
  await agent.get("/contact/success").expect(200);
  assert.equal(repository.recent().length, 1);
  assert.equal(repository.recent()[0].message, valid.message);
});
test("reject missing, forged and another visitor CSRF tokens", async (t) => {
  const { agent, app, repository } = fixture(t);
  const _csrf = await token(agent);
  await agent.post("/contact").type("form").send(valid).expect(403);
  await agent
    .post("/contact")
    .type("form")
    .send({ ...valid, _csrf: "forged" })
    .expect(403);
  const other = request.agent(app);
  await token(other);
  await other
    .post("/contact")
    .type("form")
    .send({ ...valid, _csrf })
    .expect(403);
  assert.equal(repository.recent().length, 0);
});
test("validation escapes reflected HTML and saves nothing", async (t) => {
  const { agent, repository } = fixture(t);
  const _csrf = await token(agent);
  const response = await agent
    .post("/contact")
    .type("form")
    .send({
      ...valid,
      _csrf,
      name: "<script>alert(1)</script>",
      email: "invalid",
    })
    .expect(422);
  assert.ok(!response.text.includes("<script>alert(1)</script>"));
  assert.ok(response.text.includes("&lt;script&gt;"));
  assert.equal(repository.recent().length, 0);
});
test("repeated form fields and long values fail server validation", (t) => {
  const { repository } = fixture(t);
  const service = new ContactService(repository);
  for (const input of [
    { ...valid, name: ["A", "B"] },
    { ...valid, message: "x".repeat(3001) },
    { ...valid, message: "short" },
  ]) {
    assert.throws(() => service.submit(input), ValidationError);
  }
});
test("large body and repeated attempts are rejected", async (t) => {
  const { agent } = fixture(t);
  await agent
    .post("/contact")
    .type("form")
    .send({ message: "x".repeat(17000) })
    .expect(413);
  for (let i = 0; i < 5; i++)
    await agent.post("/contact").type("form").send(valid).expect(403);
  await agent.post("/contact").type("form").send(valid).expect(429);
});
test("SQL-looking input remains data and survives reopening database", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "henry-test-"));
  const filename = path.join(directory, "test.sqlite");
  let repository;
  try {
    repository = new ContactRepository(filename);
    const message = "Robert'); DROP TABLE messages;--";
    new ContactService(repository).submit({ ...valid, message });
    repository.close();
    repository = new ContactRepository(filename);
    assert.equal(repository.recent()[0].message, message);
  } finally {
    repository?.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
test("database failures do not leak details or claim success", async (t) => {
  const config = loadConfig({ NODE_ENV: "test" });
  const app = createApp({
    config,
    repository: {
      create() {
        throw new Error("PRIVATE_DATABASE_PASSWORD");
      },
    },
  });
  const agent = request.agent(app);
  const _csrf = await token(agent);
  const response = await agent
    .post("/contact")
    .type("form")
    .send({ ...valid, _csrf })
    .expect(500);
  assert.ok(!response.text.includes("PRIVATE_DATABASE_PASSWORD"));
});
test("production requires a secret and emits secure cookies", async (t) => {
  assert.throws(() => loadConfig({ NODE_ENV: "production" }), /CSRF_SECRET/);
  const { app } = fixture(t, true);
  const response = await request(app).get("/contact").expect(200);
  assert.ok(response.headers["strict-transport-security"]);
  for (const cookie of response.headers["set-cookie"]) {
    assert.match(cookie, /^__Host-/);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /Secure/);
    assert.match(cookie, /SameSite=Strict/);
  }
});
