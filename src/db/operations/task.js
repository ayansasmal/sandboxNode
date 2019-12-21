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

const create = function(task) {
  if (!task) {
    logger.error("Task is invalid");
    throw new Error(`Task is invalid, ${JSON.stringify(task)}`);
  }
  logger.debug(
    `Creating and saving new task "${JSON.stringify(task)}", ${
      task.description
    }`
  );
  return new Task({
    description: task.description,
    completed: task.completed,
    createdOn: new Date().toLocaleDateString("en-AU", options)
  }).save();
};

const fetchAll = function(fn) {
  logger.debug("Reading all the Tasks");
  Task.find({}, fn);
};

const fetch = (id, fn) => {
  logger.debug(`Find task by id ${id}`);
  Task.findById(id, fn);
};

export default { create, fetchAll, fetch };
