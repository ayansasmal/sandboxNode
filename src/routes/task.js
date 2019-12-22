import { Router } from "express";
import Tasks from "../db/operations/task";
import { initializeLogger } from "../utils/logger";

const router = Router();

const logger = initializeLogger("task-route-js");

router.get("/read/", function(req, res) {
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

router.get("/read/:id", function(req, res) {
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

router.post("/", function(req, res) {
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

export default router;
