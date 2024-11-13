const Task = require("../model/task");
const uuid = require("uuid");

//Create Task//
const createTaskInDb = async function (taskData, userId) {
  const { title, description, dueDate, priority, assignedTo } = taskData;
  const taskId = uuid.v4();
  await Task.create({
    title,
    description,
    dueDate,
    priority,
    assignedTo,
    createdBy: userId,
    taskId: taskId,
  });
  return { taskId };
};

//Get All Tasks//
const getTasks_FromDb = async function (status, ownTask, userId, priority) {
  let tasks;
  const allTasks = await Task.find();
  if (status) {
    tasks = allTasks.filter((task) => task.status === status);
  } else if (priority) {
    tasks = allTasks.filter((task) => task.priority === priority);
  } else if (ownTask === "true") {
    tasks = allTasks.filter((task) => task.createdBy === userId);
  } else {
    tasks = allTasks;
  }
  return { tasks };
};

//Get Single Task by ID//
const getTaskById_FromDb = async (taskId, user) => {
  const task = await Task.findOne({ _id: taskId, createdBy: user.id });
  if (!task) throw new Error("Task not found");
  return task;
};

//Update Task//
const updateTask_InDb = async function (taskData, userId, taskId) {
  const { title, description, dueDate, priority, assignedTo } = taskData;
  const task = await Task.findOneAndUpdate(
    { taskId: taskId },
    { title, description, dueDate, priority, assignedTo },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) throw new Error(`invalid taskId:${taskId}`);
  return task;
};

//Delete Task//
const deleteTask_FromDb = async function (taskId) {
  const task = await Task.findOneAndDelete({ taskId: taskId });
  if (!task) throw new Error(`invalid taskId:${taskId}`);
  return;
};

//get all assigned tasks//
const get_AssignedTasks_FromDb = async function (userId) {
  const assignedTasks = await Task.find({ assignedTo: userId });
  return assignedTasks;
};

//update assigned tasks//
const update_AssignedTasks_InDb = async function (userId, taskId, status) {
  const taskDetails = await Task.findOne({
    assignedTo: userId,
    taskId: taskId,
  });
  if (!taskDetails) throw new Error(`invalid taskId:${taskId}`);
  if (taskDetails.status === "Completed")
    throw new Error(
      `taskId:${taskId} is already completed you cannot change the status`
    );

  taskDetails.status = status;
  const result = await taskDetails.save();
  return;
};

module.exports = {
  createTaskInDb,
  getTasks_FromDb,
  getTaskById_FromDb,
  updateTask_InDb,
  deleteTask_FromDb,
  get_AssignedTasks_FromDb,
  update_AssignedTasks_InDb,
};
