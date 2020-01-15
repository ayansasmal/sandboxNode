import Users from "../../db/operations/user";
import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("user-controller");

export const createUser = (req, res) => {
  logger.debug("Creating user");
  if (req.body) {
    Users.isUsernameAvailable({
      "identifier.username": req.body.identifier.username
    })
      .then(isValidResponse => {
        logger.debug(
          `User name is valid and available ${JSON.stringify(isValidResponse)}`
        );
        Users.create(req.body)
          .then(data => {
            logger.debug(`${JSON.stringify(data)}`);
            logger.debug(`Created User with id ${data._id}`);
            res.status(201);
            res.json({ status: `User created with id ${data._id}` });
          })
          .catch(err => {
            logger.error(`Unable to create user ${JSON.stringify(err)}`);
            res.status(400);
            res.json(err);
          });
      })
      .catch(err => {
        logger.error(err);
        res.status(400);
        res.json(err);
      });
  }
};
