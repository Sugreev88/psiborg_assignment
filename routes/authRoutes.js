const express = require("express");
const router = express.Router();

const {
  userSignUp,
  userLogin,
  verifyLogintoken,
  logout,
  generateAccessToken,
  loginLimiter,
  get_ProfileDetails,
  check_OnlyAdminOrManagerProfile,
  getAllUsers,
} = require("../controller/authController");

//user signup//
router.route("/signup").post(userSignUp);

//login//
router.route("/login").post(loginLimiter, userLogin);

//get profile details//
router.route("/profile").get(verifyLogintoken, get_ProfileDetails);

//get all user details//
router
  .route("/users")
  .get(verifyLogintoken, check_OnlyAdminOrManagerProfile, getAllUsers);

//logout//
router.route("/logout").post(verifyLogintoken, logout);

//refersh token//
router.route("/refresh/token").post(generateAccessToken);

module.exports = router;
