const { errorHandler, Error } = require("../error/errorHandler");

const {
  createTaskInDb,
  getTasks_FromDb,
  getTaskById_FromDb,
  updateTask_InDb,
  deleteTask_FromDb,
  get_AssignedTasks_FromDb,
  update_AssignedTasks_InDb,
  getTaskAnalytics_FromDb,
} = require("../service/taskService");

const {
  createTask_Validator,
  updateTask_Validator,
  taskSearch_Validator,
} = require("../validators/taskValidator");

//Create Task//
const createTask = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    const { error, value } = createTask_Validator.validate(req.body);

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { taskId } = await createTaskInDb(value, userId);
    res
      .status(201)
      .send({ message: `successfully created the task`, taskId: taskId });
  } catch (error) {
    errorHandler(error, next);
  }
};

//Get All Tasks//
const getTasks = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    const { status, ownTask, priority } = req.query;

    const { error, value } = taskSearch_Validator.validate(req.query);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { tasks } = await getTasks_FromDb(status, ownTask, userId, priority);
    res.status(200).send(tasks);
  } catch (error) {
    errorHandler(error, next);
  }
};

//Update Task//
const updateTask = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    const taskId = req.params.id;
    if (!taskId) Error(`taskId not found in params`);

    const { error, value } = updateTask_Validator.validate(req.body);

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const updatedTask = await updateTask_InDb(value, userId, taskId);
    res.status(200).json(updatedTask);
  } catch (error) {
    errorHandler(error, next);
  }
};

//delete Task//
const deleteTask = async function (req, res, next) {
  try {
    const taskId = req.params.id;
    if (!taskId) Error(`taskId not found in params`);
    await deleteTask_FromDb(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    errorHandler(error, next);
  }
};

//get all assigned tasks//
const get_AssignedTasks = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    const assignedTasks = await get_AssignedTasks_FromDb(userId);
    res.status(200).json(assignedTasks);
  } catch (error) {
    errorHandler(error, next);
  }
};

//update assigned tasks//
const update_AssignedTasks = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    const taskId = req.params.id;
    const { status } = req.body;

    //-check valid status-//
    if (!status) Error(`status is required`);
    const validStatus = ["In Progress", "Completed"];
    if (!validStatus.includes(status))
      Error(`status should be one of (${validStatus})`);
    //--//

    await update_AssignedTasks_InDb(userId, taskId, status);
    res.status(200).send({
      message: `Successfully updated task status to ${status}`,
      taskId: taskId,
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

//get task analytics//
const get_TaskAnalytics = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    const taskAnalytics = await getTaskAnalytics_FromDb(userId);
    res.status(200).send(taskAnalytics);
  } catch (error) {
    errorHandler(error, next);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  get_AssignedTasks,
  update_AssignedTasks,
  get_TaskAnalytics,
};
