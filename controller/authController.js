const rateLimit = require("express-rate-limit");
const { errorHandler, Error } = require("../error/errorHandler");

const {
  userRegistration_ValidatorSchema,
} = require("../validators/userRegistration-JoiValidator");

const {
  addNewUser,
  verifyLogin_Credentials,
  verify_AccessToken,
  logoutViaToken,
  verify_RefreshToken_generate_AccessToken,
  get_ProfileDetailsFrom_Db,
  fetchAll_UsersFromDb,
} = require("../service/authService");

//Login rate limit//
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message:
    "Too many login attempts from this IP, please try again after 5 minutes.",
});

//sign up the user//
const userSignUp = async function (req, res, next) {
  try {
    const { error, value } = userRegistration_ValidatorSchema.validate(
      req.body
    );

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    let { userId, accessToken, refreshToken } = await addNewUser(value);

    return res.status(201).send({
      message: `Successfully created new user`,
      userId: userId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

//user login//
const userLogin = async function (req, res, next) {
  try {
    const { error, value } = userRegistration_ValidatorSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { emailId, password } = value;
    const { accessToken, refreshToken } = await verifyLogin_Credentials(
      emailId,
      password
    );
    return res.status(200).send({
      message: `succesfully logged in `,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

//logout user//
const logout = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    await logoutViaToken(userId);
    res.status(200).send({ message: "Successfully logged Out" });
  } catch (error) {
    errorHandler(error, next);
  }
};

//get profile details//
const get_ProfileDetails = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    const profileDetails = await get_ProfileDetailsFrom_Db(userId);
    return res.status(200).send(profileDetails);
  } catch (error) {
    errorHandler(error, next);
  }
};

//verify the incoming token//
const verifyLogintoken = async function (req, res, next) {
  try {
    if (!req.headers.authorization) Error(`token not found in header`, 404);
    const accessToken =
      req.headers.authorization.split(" ")[1] ||
      req.headers.authorization.split(" ")[0];
    if (!accessToken) Error("please send token", 404);
    let user = await verify_AccessToken(accessToken);
    req.loggedInUser = user;
    req.loggedInUserId = user.userId;
    next();
  } catch (error) {
    errorHandler(error, next);
  }
};

//generate new access token (by referesh token)//
const generateAccessToken = async function (req, res, next) {
  try {
    if (!req.headers.authorization) Error(`token not found in header`, 404);
    const token =
      req.headers.authorization.split(" ")[1] ||
      req.headers.authorization.split(" ")[0];

    if (!token) Error("please send token", 404);
    const accessToken = await verify_RefreshToken_generate_AccessToken(token);
    return res.status(200).send(accessToken);
  } catch (error) {
    errorHandler(error, next);
  }
};

//get all users details
const getAllUsers = async function (req, res, next) {
  try {
    const userId = req.loggedInUserId;
    const userDetails = await fetchAll_UsersFromDb();
    return res.status(200).send(userDetails);
  } catch (error) {
    errorHandler(error, next);
  }
};

//check only admin profile
const check_OnlyAdminOrManagerProfile = async function (req, res, next) {
  try {
    const user = req.loggedInUser;
    if (!(user.role == "admin" || user.role == "manager")) {
      Error(`only admin and manager profile is allowed`);
    } else {
      next();
    }
  } catch (error) {
    errorHandler(error, next);
  }
};

module.exports = {
  userSignUp,
  errorHandler,
  userLogin,
  verifyLogintoken,
  logout,
  generateAccessToken,
  loginLimiter,
  get_ProfileDetails,
  check_OnlyAdminOrManagerProfile,
  getAllUsers,
};
