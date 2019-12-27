import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import Role from "../models/role";
import LocaleDate from "../../utils/dateUtil";

const logger = initializeLogger("role-operations-js");

mongoose.Promise = global.Promise;

const create = function(name, description) {
  logger.debug(
    `Creating and saving new role ${name} with description: "${description}"`
  );
  return new Role({
    name,
    description,
    createdBy: "Ayan",
    createdOn: LocaleDate
  }).save();
};

const fetchAll = function(fn) {
  logger.debug("Reading all the Tasks");
  return new Promise((resolve, reject) => {
    Role.find({}, (err, data) => {
      if (data) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

const fetch = role => {
  logger.debug("Reading all the Tasks");
  return new Promise((resolve, reject) => {
    Role.find({ name: role }, (err, data) => {
      if (data) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

const isValidRole = role => {
  logger.debug(`Trying to validate ${role}`);
  return new Promise((resolve, reject) => {
    Role.findOne(role, (err, data) => {
      if (data.length === 1) {
        resolve({ status: "success", message: "role is valid" });
      } else {
        reject({ status: "error", message: "No or multiple role found" });
      }
    });
  });
};

const exists = role => {
  logger.debug(`Trying to find ${JSON.stringify(role)}`);
  return new Promise((resolve, reject) => {
    Role.findOne(role, (err, data) => {
      if (data) {
        resolve(true);
      } else if (!data) {
        resolve(false);
      } else {
        reject({ status: "error", message: "Unable to find role" });
      }
    });
  });
};

export default { create, fetchAll, fetch, isValidRole, exists };
