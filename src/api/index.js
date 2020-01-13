import { initializeLogger } from "../utils/logger";
import Login from "../db/operations/login";
import User from "../db/operations/user";

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
  User.create(req.body)
    .then(data => {
      res.status(201);
      res.json({ status: `User created with id ${data._id}` });
    })
    .catch(err => {
      logger.error(err);
      res.json(err);
    });
};

export default { healthCheck, loginUser, createUser };
