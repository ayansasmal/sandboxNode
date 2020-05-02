import mongoose from "mongoose";

import User from "../models/user";
import LocaleDate from "../../utils/dateUtil";

import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("user-operations-js");

mongoose.Promise = global.Promise;

const create = async (user) => {
  logger.debug(`Creating and saving new user "${JSON.stringify(user)}"`);
  return new User({
    identifier: user.identifier,
    role: user.role,
    lastLoggedIn: LocaleDate,
    isLoggedIn: false,
  }).save();
};

const retrieveUser = async (filter) => {
  logger.debug(`Filter ${JSON.stringify(filter)}`);
  return new Promise((resolve, reject) => {
    try {
      User.find(filter, (err, data) => {
        if (err) {
          logger.error(err);
          reject({
            status: "Error",
            message: err.message,
            description: "unable to fetch user(s)",
          });
        }
        if (
          data === undefined ||
          data === null ||
          data === [] ||
          data.length === 0
        ) {
          logger.error("Empty data set");
          reject({ status: "error", message: "No Users found" });
        } else {
          logger.debug(`Got response ${data}`);
          resolve({
            status: "success",
            records: sanitizeUserData(data),
          });
        }
        return;
      });
    } catch (err) {
      logger.error(err);
      reject({
        status: "Error",
        message: err.message,
        description: "unable to fetch user(s)",
      });
    }
  });
};

const sanitizeUserData = (records) => {
  const sanitzedData = records.map((rec) => {
    //rec.password = undefined;
    //rec.iv = undefined;
    rec.isLoggedIn = undefined;
    rec._id = undefined;
    return rec;
  });
  return sanitzedData;
};

const isUsernameAvailable = async (user) => {
  logger.debug(`Finding user ${JSON.stringify(user)}`);
  return new Promise((resolve, reject) => {
    User.find(user, (err, data) => {
      logger.debug(`isUsernameAvailable Found user ${JSON.stringify(data)}`);
      if (data === undefined || data === null || data.length === 0) {
        resolve({
          status: "success",
          message: "username is available",
          description: "no user found",
        });
      } else {
        reject({ status: "error", message: "username not available" });
      }
    });
  });
};

const update = async (username, user) => {
  logger.debug(`Updating user with ${username} and ${JSON.stringify(user)}`);
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(
      { "identifier.username": username },
      user,
      (err, doc) => {
        if (doc) {
          logger.debug(`Updated doc ${doc}`);
          resolve(doc);
        }
        logger.error(`Unable to find user ${JSON.stringify(err) | username}`);
        reject({
          status: "error",
          message: `Unable to find user with ${JSON.stringify(err) | username}`,
        });
      }
    );
  });
};

const remove = async (user) => {
  return new Promise((resolve, reject) => {
    User.findOneAndDelete(user, (err, res) => {
      if (res) {
        logger.debug(`delete response ${res}`);
        resolve(res);
      }
      logger.error(
        `unable to find ${JSON.stringify(err) | JSON.stringify(user)}`
      );
      reject({
        status: "error",
        message: `Unable to find user with ${
          JSON.stringify(err) | JSON.stringify(user)
        }`,
      });
    });
  });
};

export default { create, retrieveUser, isUsernameAvailable, update, remove };
