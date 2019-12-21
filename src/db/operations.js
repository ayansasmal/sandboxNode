import mongoose from "mongoose";
import { initializeLogger } from "../utils/logger";
import Models from "./models";

const logger = initializeLogger("operations-js");

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

const createNewTask = function(description) {
  logger.debug(
    `Creating and saving new task with description: "${description}"`
  );
  return new Models.Task({
    description,
    completed: false,
    createdOn: new Date().toLocaleDateString("en-AU", options)
  }).save();
};

const fetchAllTasks = function(fn) {
  logger.debug("Reading all the Tasks");
  Models.Task.find({}, fn);
};

export default { createNewTask, fetchAllTasks };
