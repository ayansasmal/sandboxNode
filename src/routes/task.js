import { Router } from "express";
import Tasks from "../db/operations/task";
import { initializeLogger } from "../utils/logger";

const router = Router();

const logger = initializeLogger("task-route-js");

router.get("/", function(req, res) {
  Tasks.fetchAll()
    .then(tasks => {
      if (tasks && tasks.length >= 1) {
        logger.debug(`Fetched ${tasks.length} Tasks`);
        res.send(tasks);
      } else {
        logger.debug("No Task found");
        res.write(`No tasks found in system.`);
        res.end();
      }
    })
    .catch(err => {
      logger.error(`Unable to save document ${JSON.stringify(err)}`);
      res.write(`Server is up but ${JSON.stringify(err)}`);
      res.end(); //end the response
    });
});

router.get("/:id", function(req, res) {
  if (req.params.id) {
    Tasks.fetch(req.params.id)
      .then(task => {
        if (!task) {
          logger.error(`Unable to fetch document ${req.params.id}`);
          res.write(`No Task found...`);
          res.end(); //end the response
        } else if (task) {
          res.send(task);
        }
      })
      .catch(err => {
        logger.error(`Unable to fetch document ${JSON.stringify(err)}`);
        res.write(`Server is up but ${JSON.stringify(err)}`);
        res.end(); //end the response
      });
  }
});

router.post("/", function(req, res) {
  try {
    Tasks.create(req.body)
      .then(doc => {
        logger.debug(`Saved Document:: ${JSON.stringify(doc)}`);
        res.write(`Task created with id ${doc._id}`);
        res.status(201);
        res.end(); //end the response
      })
      .catch(err => {
        logger.error(`Unable to save document ${JSON.stringify(err)}`);
        res.write(`Failed to create Task due to ${JSON.stringify(err)}`);
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
