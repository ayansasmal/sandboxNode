import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import Task from "../models/task";

const logger = initializeLogger("task-operations-js");

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
  return new Task({
    description,
    completed: false,
    createdOn: new Date().toLocaleDateString("en-AU", options)
  }).save();
};

const fetchAll = function(fn) {
  logger.debug("Reading all the Tasks");
  Task.find({}, fn);
};

export default { create, fetchAll };
