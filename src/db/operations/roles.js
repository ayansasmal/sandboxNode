import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import Role from "../models/role";

const logger = initializeLogger("role-operations-js");

mongoose.Promise = global.Promise;

const options = {
  timeZone: "Australia/Sydney",
  hour12: false,
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
};

const create = function(name, description) {
  logger.debug(
    `Creating and saving new role ${name} with description: "${description}"`
  );
  return new Role({
    name,
    description,
    createdBy: "Ayan",
    createdOn: new Date().toLocaleDateString("en-AU", options)
  }).save();
};

const fetchAll = function(fn) {
  logger.debug("Reading all the Tasks");
  Role.find({}, fn);
};

export default { create, fetchAll };
