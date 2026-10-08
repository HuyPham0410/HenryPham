// Compose middleware, controllers, and routes in request-processing order.
const express = require("express");
const path = require("node:path");
const { root } = require("./config.js");
const { installSecurity } = require("./middleware/security.js");
const { PageController } = require("./controllers/PageController.js");
const { ContactController } = require("./controllers/ContactController.js");
const { ContactService } = require("./services/ContactService.js");
const { createRoutes } = require("./routes/index.js");

function createApp({ config, repository }) {
  const app = express();
  // Make trusted portfolio content available to every shared EJS partial.
  app.locals.profile = require("./data/content.js").profile;
  app.set("view engine", "ejs");
  app.set("views", path.join(root, "src/views"));
  const security = installSecurity(app, config);
  app.use(
    express.urlencoded({ extended: false, limit: "16kb", parameterLimit: 10 }),
  );
  app.use(
    "/assets",
    express.static(path.join(root, "public"), {
      dotfiles: "deny",
      index: false,
    }),
  );
  const pages = new PageController();
  const contact = new ContactController(
    new ContactService(repository),
    security.generateCsrfToken,
  );
  app.use(createRoutes(pages, contact, security));
  app.use((req, res) =>
    res.status(404).render("pages/error", {
      title: "Page not found",
      active: "",
      status: 404,
      message: "This page could not be found.",
    }),
  );
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status =
      error.code === "EBADCSRFTOKEN"
        ? 403
        : [400, 413, 415].includes(error.status)
          ? error.status
          : 500;
    if (status === 500)
      console.error("Request failed:", error.code || error.name);
    const messages = {
      400: "The request could not be read.",
      403: "Your form expired or could not be verified. Open Contact and try again.",
      413: "The submitted form is too large.",
      415: "Unsupported form encoding.",
      500: "Something went wrong. Please try again later.",
    };
    res.status(status).render("pages/error", {
      title: "Request error",
      active: "",
      status,
      message: messages[status],
    });
  });
  return app;
}

module.exports = { createApp };
