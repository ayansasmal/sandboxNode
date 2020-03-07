import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import ErrorCode from "../models/errorCode";
import { errors } from "../../api-interface/errors.json";

const logger = initializeLogger("errorCode-operation-js");

mongoose.Promise = global.Promise;

export const fetchAllError = async () => {
  ErrorCode.find({}, (err, data) => {
    if (data) {
      resolve(data);
    } else if (data.length === 0) {
      reject({ status: "error", message: "Cannot fetch the error codes" });
    } else {
      reject(err);
    }
  });
};

export const getErrorDetails = async code => {
  ErrorCode.find({ code }, (err, data) => {
    if (data) {
      resolve(data);
    } else {
      reject(err);
    }
  });
};

const loadErrors = errors => {
  errors.forEach(err => {
    new ErrorCode(err).save().then(data => {
      logger.debug(`Created error ${data.code}`);
    });
  });
};

loadErrors(errors);
