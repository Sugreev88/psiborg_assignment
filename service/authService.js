const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const UserRegistration = require("../model/userRegistration");
const ValidationError = require("../error/validationError");
const { errorHandler, Error } = require("../error/errorHandler");

//add new user//
const addNewUser = async function (value) {
  const { userName, password, role, emailId } = value;
  const userId = uuid.v4();

  //--create tokens and hash the password--//
  const JWT_SECRET = process.env.SECRET_JWT;
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "10h" });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  //--//

  //- add the new user details -//
  let existingUser = await UserRegistration.findOne({ userName: userName });
  if (!existingUser) {
    existingUser = new UserRegistration({
      userName,
      role,
      emailId,
      password: hashedPassword,
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId,
    });
  } else {
    Error(`emailId:${emailId} already exists || Please Login`);
  }
  //--//

  let user = await existingUser.save();
  return { userId, accessToken, refreshToken };
};

// //

// generate new access token ( by referesh token )  //
const verify_RefreshToken_generate_AccessToken = async function (refreshToken) {
  const tokenDetails = await jwt.verify(refreshToken, process.env.SECRET_JWT);

  let userDetails = await UserRegistration.findOne({
    userId: tokenDetails.userId,
  });

  if (!(userDetails && userDetails.refreshToken == refreshToken))
    Error(`UserDetails Not found for the refreshToken:${refreshToken}`);

  const userId = tokenDetails.userId;

  const accessToken = jwt.sign({ userId }, process.env.SECRET_JWT, {
    expiresIn: "10h",
  });
  userDetails.accessToken = accessToken;
  await userDetails.save();
  return { accessToken };
};

//send welcome mail//
const send_WelcomeMail = async function (emailId) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASS,
    },
    debug: true,
  });
  console.log("here", emailId, process.env.GMAIL, process.env.GMAIL_PASS);
  let mailOptions = {
    from: process.env.GMAIL,
    to: emailId,
    subject: "Welcome",
    // html: `
    //   <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    //   <h2 style="color: #333;">registration successfull</h2>
    //   <p style="color: #666;">Thank you!</p>
    // </div>
    // `,
  };
  console.log(transporter.sendMail(mailOptions, function (error, info) {}));
  return transporter.sendMail(mailOptions, function (error, info) {});
};

// verify the incoming token (logged in user token) with saved token //
const verify_AccessToken = async function (accessToken) {
  const tokenDetails = await jwt.verify(accessToken, process.env.SECRET_JWT);

  let userDetails = await UserRegistration.findOne({
    userId: tokenDetails.userId,
  });

  if (!(userDetails && userDetails.accessToken == accessToken))
    Error(`Invalid token.Please Login`, 401);

  const user = userDetails;
  return user;
};

//logout the user//
const logoutViaToken = async function (userId) {
  let result = await UserRegistration.findOneAndUpdate(
    { userId: userId },
    { $set: { accessToken: "", refreshToken: "" } }
  );
  return;
};

// verify the incoming emailId and password //
const verifyLogin_Credentials = async function (emailId, password) {
  const userDetails = await UserRegistration.findOne({ emailId: emailId });
  if (!userDetails) Error(`emailId:${emailId} does not exists please signup`);
  const checkPassword = await bcrypt.compare(password, userDetails.password);
  if (!checkPassword) Error(`Invalid password:${password}`);

  //--create tokens and save token--//

  const userId = userDetails.userId;
  const JWT_SECRET = process.env.SECRET_JWT;
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "10h" });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

  userDetails.accessToken = accessToken;
  userDetails.refreshToken = refreshToken;
  await userDetails.save();

  //--//
  return { accessToken, refreshToken };
};

//get profile details from db
const get_ProfileDetailsFrom_Db = async function (userId) {
  const profileDetails = await UserRegistration.findOne(
    { userId: userId },
    { emailId: 1, userName: 1, role: 1 }
  );
  return profileDetails;
};

//fetch users from DB
const fetchAll_UsersFromDb = async function () {
  const userDetails = await UserRegistration.find(
    {},
    {
      emailId: 1,
      userName: 1,
      role: 1,
      userId: 1,
    }
  );
  return userDetails;
};

module.exports = {
  addNewUser,
  verify_AccessToken,
  logoutViaToken,
  verify_RefreshToken_generate_AccessToken,
  get_ProfileDetailsFrom_Db,
  verifyLogin_Credentials,
  fetchAll_UsersFromDb,
};
