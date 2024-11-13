const Joi = require("joi");

const createTask_Validator = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim(),
  dueDate: Joi.string().trim().required(),
  priority: Joi.string().trim().valid("Low", "Medium", "High").required(),
  assignedTo: Joi.string().trim().required(),
});

const updateTask_Validator = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  dueDate: Joi.string().trim(),
  priority: Joi.string().trim().valid("Low", "Medium", "High"),
  status: Joi.string().trim().valid("Pending", "In Progress", "Completed"),
  assignedTo: Joi.string().trim(),
});

const taskSearch_Validator = Joi.object({
  ownTask: Joi.string().trim().valid("true", "false"),
  priority: Joi.string().trim().valid("Low", "Medium", "High"),
  status: Joi.string().trim().valid("Pending", "In Progress", "Completed"),
});

module.exports = {
  createTask_Validator,
  updateTask_Validator,
  taskSearch_Validator,
};
