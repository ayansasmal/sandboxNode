import mongoose from "mongoose";
import Validator from "validator";

const Login = mongoose.model("Login", {
  username: {
    type: String,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!Validator.isEmail(value)) {
        throw new Error("Provided email is not valid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase().trim() === "password") {
        throw new Error("Entered password is not allowed");
      }
    }
  }
});

export default Role;
