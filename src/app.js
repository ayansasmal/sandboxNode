import express from "express";
import Tasks from "./db/operations/task";
import { connectDatabase, closeDatabase, clearDatabase } from "./db/handler";
import { createServer } from "http";
import { initializeLogger } from "./utils/logger";

const logger = initializeLogger("app-js");

logger.info("Server is up and running");

const app = express();
app.use(express.json());

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
  try {
    const task = Tasks.create(req.body, "");
    task
      .then(doc => {
        logger.debug(`Saved Document:: ${JSON.stringify(doc)}`);
        res.write(`${new Date()} Server is up and ${doc._id}`);
        res.status(201);
        res.end(); //end the response
      })
      .catch(err => {
        logger.error(`Unable to save document ${JSON.stringify(err)}`);
        res.write(`${new Date()} Server is up but ${JSON.stringify(err)}`);
        res.status(400);
        res.end(); //end the response
      });
  } catch (err) {
    logger.error("Unable to create Task", err);
    res.sendStatus(400);
    res.end(); //end the response
  }
});

app.get("/task/read/", function(req, res) {
  Tasks.fetchAll((err, tasks) => {
    if (err) {
      logger.error(`Unable to save document ${JSON.stringify(err)}`);
      res.write(`Server is up but ${JSON.stringify(err)}`);
      res.end(); //end the response
    } else if (tasks) {
      res.send(tasks);
    }
  });
});

app.get("/task/read/:id", function(req, res) {
  if (req.params.id) {
    Tasks.fetch(req.params.id, (err, task) => {
      if (err) {
        logger.error(`Unable to save document ${JSON.stringify(err)}`);
        res.write(`Server is up but ${JSON.stringify(err)}`);
        res.end(); //end the response
      } else if (task) {
        res.send(task);
      }
    });
  }
});

app.post("/user/create", function(req, res) {
  logger.debug("Trying to create user");
});

app.get("/user/", function(req, res) {
  logger.debug("Trying to create user");
});
