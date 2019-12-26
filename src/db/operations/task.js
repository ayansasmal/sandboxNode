import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import Task from "../models/task";
import LocaleDate from "../../utils/dateUtil";

const logger = initializeLogger("task-operations-js");

mongoose.Promise = global.Promise;

const create = task => {
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
    createdOn: LocaleDate
  }).save();
};

const fetchAll = () => {
  logger.debug("Reading all the Tasks");
  return new Promise((resolve, reject) => {
    Task.find({}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const fetch = id => {
  logger.debug(`Find task by id ${id}`);
  return new Promise((resolve, reject) => {
    Task.findById(id, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export default { create, fetchAll, fetch };
