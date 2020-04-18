import mongoose from "mongoose";
import Validator from "validator";
import AuditEvent from "../operations/audit";
import bcrypt from "bcrypt";

import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("login-model-js");

const LoginSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!Validator.isEmail(value)) {
          throw new Error("Provided email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      async validate(value) {
        const comparison = await bcrypt.compare("password", value);
        if (comparison) {
          throw new Error("Entered password is not allowed");
        }
      },
    },
    lastLoggedIn: {
      type: String,
    },
    isLoggedIn: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

LoginSchema.post("save", (doc, next) => {
  logger.debug("creating a login credential");
  AuditEvent.createAudit("creating login credentials", doc);
  next();
});

// LoginSchema.post("updateOne", { document: true, query: false }, (doc, next) => {
LoginSchema.post("updateOne", (doc, next) => {
  logger.debug(`Updating document ${JSON.stringify(doc)}`);
  AuditEvent.createAudit("updating login credentials", this);
  next();
});

LoginSchema.post("find", (result) => {
  logger.debug(`Query ${JSON.stringify(this)}`);
  AuditEvent.createAudit("searching login credentials", this);
  logger.debug(`Found ${JSON.stringify(result)}`);
});

const Login = mongoose.model("Login", LoginSchema);

export default Login;
