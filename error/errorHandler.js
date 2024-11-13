const { default: mongoose } = require("mongoose");
const ValidationError = require("../error/validationError");

const errorHandler = async function (error, next) {
  if (error instanceof mongoose.Error.ValidationError) {
    next(new ValidationError(error.message));
  } else if (error.code == 11000) {
    next(new ValidationError(error.message));
  }
  next(error);
};

const Error = function (error, status) {
  const errorStatus = status;
  throw new ValidationError(error, errorStatus);
};

module.exports = { errorHandler, Error };
