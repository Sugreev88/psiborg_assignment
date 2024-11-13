const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    taskId: { type: String, unique: true },
    assignedTo: {
      type: String,
      index: 1,
    },
    createdBy: {
      type: String,
      index: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
