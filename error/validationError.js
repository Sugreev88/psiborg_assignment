class ValidationError extends Error {
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status || 400;
  }
}

module.exports = ValidationError;
