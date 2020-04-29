import mongoose from "mongoose";

import User from "../models/user";
import LocaleDate from "../../utils/dateUtil";

import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("user-operations-js");

mongoose.Promise = global.Promise;

const create = async user => {
  logger.debug(`Creating and saving new user "${JSON.stringify(user)}"`);
  return new User({
    identifier: user.identifier,
    role: user.role,
    lastLoggedIn: LocaleDate,
    isLoggedIn: false
  }).save();
};

const retrieveUser = async filter => {
  logger.debug(`Filter ${JSON.stringify(filter)}`);
  return new Promise((resolve, reject) => {
    try {
      User.find(filter, (err, data) => {
        if (err) {
          logger.error(err);
          reject({
            status: "Error",
            message: err.message,
            description: "unable to fetch user(s)"
          });
        }
        if (data === null || data === [] || data.length === 0) {
          logger.error("Empty data set");
          reject({ status: "error", message: "No Users found" });
        } else {
          logger.debug(`Got response ${data}`);
          resolve({
            status: "success",
            records: sanitizeUserData(data)
          });
        }
        return;
      });
    } catch (err) {
      logger.error(err);
      reject({
        status: "Error",
        message: err.message,
        description: "unable to fetch user(s)"
      });
    }
  });
};

const sanitizeUserData = records => {
  const sanitzedData = records.map(rec => {
    //rec.password = undefined;
    //rec.iv = undefined;
    rec.isLoggedIn = undefined;
    rec._id = undefined;
    return rec;
  });
  return sanitzedData;
};

const isUsernameAvailable = async user => {
  logger.debug(`Finding user ${JSON.stringify(user)}`);
  return new Promise((resolve, reject) => {
    User.find(user, (err, data) => {
      logger.debug(`isUsernameAvailable Found user ${JSON.stringify(data)}`);
      if (data === undefined || data === null || data.length === 0) {
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

const verify = async user => {
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

const update = async user => {};

const login = async user => {
  logger.debug(`Updating login for ${JSON.stringify(user)}`);
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate(
        user,
        { lastLoggedIn: LocaleDate, isLoggedIn: true },
        { new: true },
        (err, data) => {
          if (data) {
            logger.debug(`Updated user :: ${JSON.stringify(data)}`);
            resolve(data);
          } else {
            logger.error(JSON.stringify(err));
            reject({ status: "Error", description: err.message });
          }
        }
      );
    } catch (err) {
      logger.error(JSON.stringify(err));
      reject({ status: "Error", description: err.message });
    }
  });
};

export default { create, retrieveUser, verify, isUsernameAvailable, login };
