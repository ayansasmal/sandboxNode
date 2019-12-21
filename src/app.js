import express from "express";
import Tasks from "./db/operations/task";
import { connectDatabase, closeDatabase, clearDatabase } from "./db/handler";
import { createServer } from "http";
import { initializeLogger } from "./utils/logger";

const logger = initializeLogger("app-js");

logger.info("Server is up and running");

const app = express();
const port = process.env.PORT || 8080;
//create a server object:
createServer(app).listen(port); //the server object listens on port 8080
connectDatabase();

app.get("/", function(req, res) {
  logger.debug("got root");
  res.write(`${new Date()} Server is up and ready to use`);
  res.end(); //end the response
});

app.post("/task", function(req, res) {
  const task = Tasks.create("New Task created");
  task
    .then(doc => {
      logger.debug(`Saved Document:: ${JSON.stringify(doc)}`);
      res.write(`${new Date()} Server is up and ${doc._id}`);
      res.end(); //end the response
    })
    .catch(err => {
      logger.error(`Unable to save document ${JSON.stringify(err)}`);
      res.write(`${new Date()} Server is up but ${JSON.stringify(err)}`);
      res.end(); //end the response
    });
});

app.get("/task/read", function(req, res) {
  res.write(`${new Date()} fetching...\n`);
  Tasks.fetchAll((err, tasks) => {
    if (err) {
      logger.error(`Unable to save document ${JSON.stringify(err)}`);
      res.write(`Server is up but ${JSON.stringify(err)}`);
    } else if (tasks) {
      res.write(`Fetched...\n[${tasks.length}]\n`);
      tasks.forEach(task => {
        logger.debug(`Task is ${JSON.stringify(task)}`);
        res.write(`Task : ${JSON.stringify(task)}\n`);
      });
    }
    res.end(); //end the response
  });
});

app.post("/user/create", function(req, res) {
  logger.debug("Trying to create user");
});

app.get("/user/", function(req, res) {
  logger.debug("Trying to create user");
});
