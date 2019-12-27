import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import User from "../models/user";
import LocaleDate from "../../utils/dateUtil";
import password from "../../utils/password";

const logger = initializeLogger("user-operations-js");

mongoose.Promise = global.Promise;

const create = function(user) {
  logger.debug(`Creating and saving new user  "${JSON.stringify(user)}"`);
  const newPass = password.encrypt(user.password);
  return new User({
    identifier: user.identifier,
    password: newPass.encryptedData,
    role: user.role,
    createdOn: LocaleDate,
    lastLoggedIn: LocaleDate,
    isLoggedIn: true,
    iv: newPass.iv
  }).save();
};

const fetchAll = function(fn) {
  logger.debug("Reading all the Tasks");
  User.find({}, fn);
};

const isUsernameAvailable = user => {
  logger.debug(`Finding user ${JSON.stringify(user)}`);
  return new Promise((resolve, reject) => {
    User.find(user, (err, data) => {
      if (data === null || data.length === 0) {
        resolve({
          status: "success",
          message: "username is available",
          description: "no user found"
        });
      } else {
        reject({ status: "error", message: "username not available" });
      }
    });
  });
};

const addRole = () => {
  logger.debug("Adding role to the current user");
};

const verify = user => {
  logger.debug(`Finding user ${JSON.stringify(user)}`);
  return new Promise((resolve, reject) => {
    if (user) {
      User.findOne(user, (err, data) => {
        logger.debug(`Found user ${JSON.stringify(data)}`);
        if (data) {
          resolve(data);
        } else if (err) {
          reject(err);
        } else {
          reject({
            status: "Error",
            description: "Unable to find the user",
            message: "Please verify the username and password combination."
          });
        }
      });
    }
  });
};

const update = () => {};

const login = () => {};

export default { create, fetchAll, verify, isUsernameAvailable };
