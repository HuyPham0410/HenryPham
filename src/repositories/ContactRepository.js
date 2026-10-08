// Encapsulate SQLite access and bind values to prepared statements instead of concatenating SQL.
const { DatabaseSync } = require("node:sqlite");
const { mkdirSync } = require("node:fs");
const path = require("node:path");

class ContactRepository {
  #db;
  constructor(filename) {
    if (filename !== ":memory:")
      mkdirSync(path.dirname(filename), { recursive: true });
    this.#db = new DatabaseSync(filename);
    this.#db.exec(`PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      )`);
  }
  // Bind user input as data; never interpolate it into SQL syntax.
  create({ name, email, message }) {
    return this.#db
      .prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)")
      .run(name, email, message).lastInsertRowid;
  }
  // Limit owner-facing reads to the 50 newest messages.
  recent() {
    return this.#db
      .prepare("SELECT * FROM messages ORDER BY id DESC LIMIT 50")
      .all();
  }
  close() {
    this.#db.close();
  }
}

module.exports = { ContactRepository };
