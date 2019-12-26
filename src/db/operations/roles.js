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
  Role.find({}, fn);
};

export default { create, fetchAll };
