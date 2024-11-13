const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user", "manager"],
      default: "user",
    },
    emailId: {
      type: String,
      unique: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    otp: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const UserRegistration = mongoose.model("UserRegistration", UserSchema);

module.exports = UserRegistration;
