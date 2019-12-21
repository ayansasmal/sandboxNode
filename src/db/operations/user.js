import mongoose from "mongoose";
import { initializeLogger } from "../utils/logger";
import User from "../models/user";

const logger = initializeLogger("user-operations-js");

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

const create = function(description) {
  logger.debug(
    `Creating and saving new task with description: "${description}"`
  );
  return new User({
    description,
    completed: false,
    createdOn: new Date().toLocaleDateString("en-AU", options)
  }).save();
};

const fetchAll = function(fn) {
  logger.debug("Reading all the Tasks");
  User.find({}, fn);
};

export default { create, fetchAll };
