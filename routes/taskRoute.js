const express = require("express");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  get_AssignedTasks,
  update_AssignedTasks,
  get_TaskAnalytics,
} = require("../controller/taskController");

const {
  verifyLogintoken,
  check_OnlyAdminOrManagerProfile,
} = require("../controller/authController");

const router = express.Router();

//create task//
router
  .route("/task")
  .post(verifyLogintoken, check_OnlyAdminOrManagerProfile, createTask);

//get task//
router
  .route("/tasks")
  .get(verifyLogintoken, check_OnlyAdminOrManagerProfile, getTasks);

//update task//
router
  .route("/task/:id")
  .put(verifyLogintoken, check_OnlyAdminOrManagerProfile, updateTask);

//delete task//
router
  .route("/task/remove/:id")
  .delete(verifyLogintoken, check_OnlyAdminOrManagerProfile, deleteTask);

//assigned tasks//
router.route("/user/task").get(verifyLogintoken, get_AssignedTasks);

//update assigned tasks//
router.route("/user/task/:id").patch(verifyLogintoken, update_AssignedTasks);

//get task analytics//
router.route("/task/analytics").get(verifyLogintoken, get_TaskAnalytics);

module.exports = router;
