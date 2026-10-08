// Load local environment variables before any application modules read configuration.
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });
require("./src/server");
