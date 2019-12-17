import { createServer } from "http";
import express from "express";
import { initializeLogger } from "./utils/logger";
import mongoose from "./db/mongoose";

const logger = initializeLogger("app-js");

logger.info("Server is up and running");

const app = express();
//create a server object:
createServer(app).listen(8080); //the server object listens on port 8080

app.get("/", function(req, res) {
  res.write(`Server is up and ready to use`);
  res.end(); //end the response
});

app.get("/task/create", function(req, res) {
  const task = mongoose.createNewTask("New Task created");
  task
    .then(doc => {
      logger.debug(`Saved Document:: ${JSON.stringify(doc)}`);
      res.write(`Server is up and ${doc._id}`);
      res.end(); //end the response
    })
    .catch(err => {
      logger.error(`Unable to save document ${JSON.stringify(err)}`);
      res.write(`Server is up but ${JSON.stringify(err)}`);
      res.end();
    });
});

app.get("/task/read", function(req, res) {
  mongoose.fetchAllTasks((err, tasks) => {
    if (err) {
      logger.error(`Unable to save document ${JSON.stringify(err)}`);
      res.write(`Server is up but ${JSON.stringify(err)}`);
      res.end();
    } else if (tasks) {
      tasks.forEach(task => {
        logger.debug(`Task is ${JSON.stringify(task)}`);
        res.write(`Task : ${JSON.stringify(task)}\n`);
      });
      // logger.debug(`Saved Document:: ${JSON.stringify(tasks)}`);
      // res.write(`Server is up and ${JSON.stringify(tasks)}`);
      res.end(); //end the response
    }
  });
});

app.get("/user/create", function(req, res) {
  logger.debug("Trying to create user");
  // const task = mongoose.createNewTask("New Task created");
  // task
  //   .then(doc => {
  //     logger.debug(`Saved Document:: ${JSON.stringify(doc)}`);
  //     res.write(`Server is up and ${doc._id}`);
  //     res.end(); //end the response
  //   })
  //   .catch(err => {
  //     logger.error(`Unable to save document ${JSON.stringify(err)}`);
  //     res.write(`Server is up but ${JSON.stringify(err)}`);
  //     res.end();
  //   });
});
