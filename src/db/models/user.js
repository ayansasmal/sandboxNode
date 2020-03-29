import mongoose from "mongoose";
import Validator from "validator";
import AuditEvent from "../operations/audit";

import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("user-model-js");
const UserSchema = new mongoose.Schema(
  {
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
    role: {
      type: [String]
    }
  },
  { timestamps: true }
);

/** Pre user schema actions */

UserSchema.pre("save", next => {
  logger.debug(`Saving document`);
  next();
});

UserSchema.pre("validate", next => {
  logger.debug(`validating document`);
  next();
});

UserSchema.post("save", async (doc, next) => {
  logger.debug("in post save");
  await AuditEvent.createAudit("create user", doc);
  next();
});

UserSchema.post("validate", doc => {
  logger.debug(`validated doc ${JSON.stringify(doc)}`);
});

const User = mongoose.model("User", UserSchema);

export default User;
