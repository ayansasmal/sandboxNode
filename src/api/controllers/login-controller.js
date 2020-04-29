import Login from "../../db/operations/login";
import { getData } from "../../utils/jwt";
import { initializeLogger } from "../../utils/logger";
import { getAuth } from "../../utils/headerUtils";

const logger = initializeLogger("login-controller");

export const loginUser = (req, res) => {
  logger.debug("Login interface invoked");
  try {
    if (!req.body.username) {
      throw new Error("Request data is not present");
    }
    Login.login(req.body)
      .then((data) => {
        logger.debug(data);
        res.set("authorization", data.jwt);
        res.cookie("jwt", data.jwt);
        res.status(204);
        res.json({ status: "Login successfull" });
      })
      .catch((err) => {
        logger.error(err);
        res.status(403);
        res.json(err);
      });
  } catch (err) {
    logger.error(err);
    res.status(500);
    res.json(err);
  }
};

export const whoami = (req, res) => {
  logger.debug("checking who is logged in");
  const authToken = getAuth();
  logger.debug(`Auth token   ${authToken}`);
  try {
    if (authToken) {
      const data = getData(authToken);
      logger.debug(`Data from jwt ${JSON.stringify(data)}`);
      res.set("Content-Type", "application/json");
      res.json({ username: data.username });
    } else {
      res.status(404);
      res.set("Content-Type", "application/json");
      res.send();
    }
  } catch (err) {
    logger.error(err);
    res.set("Content-Type", "application/json");
    res.status(500);
    res.json(err);
  }
};
