import { Router } from "express";
import Users from "../db/operations/user";
import { initializeLogger } from "../utils/logger";

const router = Router();

const logger = initializeLogger("user-route-js");

router.post("/", function(req, res) {
  logger.debug("Trying to create user");
  if (req.body) {
    Users.create(req.body)
      .then(data => {
        logger.debug(`Created User with id ${data._id}`);
        res.write(`Created User with id ${data._id}`);
        res.status(201);
        res.send();
      })
      .catch(err => {
        logger.error(`Unable to create user ${JSON.stringify(err)}`);
        res.write(`Failed to create user ${err}`);
        res.send();
      });
  }
});

router.get("/", function(req, res) {
  logger.debug("Trying to create user");
});

export default router;
