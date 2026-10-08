// Map public URLs to controllers; protect form submissions before invoking application logic.
const { Router } = require("express");

function createRoutes(pages, contact, security) {
  const router = Router();
  for (const [oldPath, newPath] of Object.entries({
    "/index.html": "/",
    "/work.html": "/work",
    "/contact.html": "/contact",
  })) {
    router.get(oldPath, (req, res) => res.redirect(301, newPath));
  }
  router.get("/", pages.home);
  router.get("/work", pages.work);
  // The resume is public; the PDF is served only from the public documents folder.
  router.get("/resume", pages.resume);
  router.get("/contact/success", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.render("pages/success", {
      title: "Message received",
      active: "contact",
    });
  });
  router.get("/contact", security.identify, contact.show);
  router.post(
    "/contact",
    security.contactLimiter,
    security.identify,
    security.doubleCsrfProtection,
    contact.submit,
  );
  router.get("/health", (req, res) => res.json({ status: "ok" }));
  return router;
}

module.exports = { createRoutes };
