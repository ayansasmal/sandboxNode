import { initializeLogger } from "../utils/logger";
import Login from "../db/operations/login";
import Users from "../db/operations/user";

const logger = initializeLogger("api");

const healthCheck = (req, res) => {
  res.json({ status: "The application is up and running" });
};

const loginUser = (req, res) => {
  logger.debug("Login interface invoked");
  Login.login(req.body)
    .then(data => {
      res.set("session", data.jwt);
      res.cookie("jwt", data.jwt);
      res.json({ status: "Login successfull" });
    })
    .catch(err => {
      logger.error(err);
      res.json(err);
    });
  // res.send("logged in successfully");
};

const createUser = (req, res) => {
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

export default { healthCheck, loginUser, createUser };
