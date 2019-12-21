import mongoose from "mongoose";
import Validator from "validator";

const Models = {};
Models.Task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdOn: {
    type: String
  }
});

Models.User = mongoose.model("User", {
  identifier: {
    username: {
      type: String,
      trim: true
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
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

export default Models;
