import mongoose from "mongoose";
import Validator from "validator";

const User = mongoose.model("User", {
  identifier: {
    username: {
      type: String,
      trim: true,
      required: true
    },
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      validate(value) {
        if (!Validator.isEmail(value)) {
          throw new Error("Provided email is not valid");
        }
      }
    },
    mobileNumber: {
      type: String
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
  },
  createdOn: {
    type: String
  },
  lastLoggedIn: {
    type: String
  },
  isLoggedIn: {
    type: Boolean
  },
  role: {
    type: [String]
  }
});

export default User;
