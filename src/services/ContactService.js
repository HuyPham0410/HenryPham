// Validate untrusted contact fields before passing normalized values to the repository.
class ValidationError extends Error {
  constructor(errors, values) {
    super("Invalid contact form");
    this.errors = errors;
    this.values = values;
  }
}

class ContactService {
  constructor(repository) {
    this.repository = repository;
  }
  // Reject arrays, empty fields, and oversized messages even if browser validation is bypassed.
  submit(input = {}) {
    const values = {};
    const errors = {};
    for (const [key, min, max] of [
      ["name", 2, 80],
      ["email", 3, 254],
      ["message", 10, 3000],
    ]) {
      const raw = input[key];
      values[key] = typeof raw === "string" ? raw.trim() : "";
      if (
        typeof raw !== "string" ||
        values[key].length < min ||
        values[key].length > max
      ) {
        errors[key] = `${key}: please enter ${min}–${max} characters.`;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errors.email = "Please enter a valid email address.";
    if (Object.keys(errors).length) throw new ValidationError(errors, values);
    return this.repository.create(values);
  }
}

module.exports = { ValidationError, ContactService };
