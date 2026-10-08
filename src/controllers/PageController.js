const { profile, projects } = require("../data/content.js");

// Render public portfolio pages using CV data, without exposing database records.
class PageController {
  resume = (req, res) =>
    res.render("pages/resume", { title: "Resume", active: "resume", profile });
  home = (req, res) =>
    res.render("pages/index", {
      title: "Home",
      active: "home",
      profile,
      projects,
    });
  work = (req, res) =>
    res.render("pages/work", { title: "Work", active: "work", projects });
}

module.exports = { PageController };
