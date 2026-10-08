// Start the HTTP listener and close the database when the process shuts down.
const { loadConfig } = require("./config.js");
const { createApp } = require("./app.js");
const { ContactRepository } = require("./repositories/ContactRepository.js");

const config = loadConfig();
const repository = new ContactRepository(config.databasePath);
const app = createApp({ config, repository });
const server = app.listen(config.port, config.host, () => {
  console.log(`Henry's website: http://${config.host}:${config.port}`);
});
server.on("error", (error) => {
  console.error(error.message);
  repository.close();
  process.exitCode = 1;
});
let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  server.close(() => {
    repository.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
