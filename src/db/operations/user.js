import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import User from "../models/user";
import LocaleDate from "../../utils/dateUtil";

const logger = initializeLogger("user-operations-js");

mongoose.Promise = global.Promise;

const create = function(user) {
  logger.debug(`Creating and saving new user  "${JSON.stringify(user)}"`);
  return new User({
    identifier: user.identifier,
    password: user.password,
    role: user.role,
    createdOn: LocaleDate,
    lastLoggedIn: LocaleDate,
    isLoggedIn: true
  }).save();
};

const fetchAll = function(fn) {
  logger.debug("Reading all the Tasks");
  User.find({}, fn);
};

const addRole = () => {
  logger.debug("Adding role to the current user");
};

const verify = user => {
  return new Promise((resolve, reject) => {
    if (user) {
      User.findOne(user, (err, data) => {
        if (data) {
          resolve(data);
        } else if (err) {
          reject(err);
        }
      });
    }
  });
};

const update = () => {};

const login = () => {};

export default { create, fetchAll, verify };
