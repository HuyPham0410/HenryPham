// Translate HTTP requests into service calls and render validation errors without losing form input.
const { ValidationError } = require("../services/ContactService.js");

class ContactController {
  constructor(service, generateToken) {
    this.service = service;
    this.generateToken = generateToken;
  }
  // Disable form caching so each rendered form carries the current CSRF token.
  render(req, res, { errors = {}, values = {}, status = 200 } = {}) {
    res.set("Cache-Control", "no-store");
    return res.status(status).render("pages/contact", {
      title: "Contact",
      active: "contact",
      errors,
      values,
      csrfToken: this.generateToken(req, res),
    });
  }
  show = (req, res) => this.render(req, res);
  // Redirect after a successful POST so refreshing the result page does not resubmit the form.
  submit = (req, res, next) => {
    try {
      this.service.submit(req.body);
      res.redirect(303, "/contact/success");
    } catch (error) {
      if (error instanceof ValidationError) {
        return this.render(req, res, {
          errors: error.errors,
          values: error.values,
          status: 422,
        });
      }
      next(error);
    }
  };
}

module.exports = { ContactController };
