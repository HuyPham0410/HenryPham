// Local owner-only utility: print recent messages without exposing an HTTP admin endpoint.
const path = require("node:path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  quiet: true,
});
const { loadConfig } = require("../src/config.js");
const {
  ContactRepository,
} = require("../src/repositories/ContactRepository.js");
const repository = new ContactRepository(loadConfig().databasePath);
try {
  console.log(JSON.stringify(repository.recent(), null, 2));
} finally {
  repository.close();
}
