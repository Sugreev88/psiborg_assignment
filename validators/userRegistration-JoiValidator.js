const Joi = require("joi");

const userRegistration_ValidatorSchema = Joi.object({
  userName: Joi.string()
    .trim()
    .pattern(/^(?!<[^>]*>)[a-zA-Z0-9_@]+$/)
    .message(
      "Invalid characters in name || It should only contain alphabets, numbers, underscore (_), or @ symbol. HTML tags are not allowed."
    ),
  emailId: Joi.string().email().required(),
  role: Joi.string().valid("admin", "user", "manager"),
  password: Joi.string()
    .trim()
    .required()
    .pattern(/^(?=.*[@#$%^&*()-])[a-zA-Z0-9_@#$%^&*()-]+$/)
    .message(
      "Invalid password format || It should contain only alphabets, numbers, underscore, and at least one of the following special characters: @#$%^&*()-"
    ),
});

const email_Validator_Schema = Joi.object({
  emailId: Joi.string().email().required(),
});

module.exports = { userRegistration_ValidatorSchema, email_Validator_Schema };
