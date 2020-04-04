import Login from "../../db/operations/login";
import { getData } from "../../utils/jwt";
import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("login-controller");

export const loginUser = (req, res) => {
  logger.debug("Login interface invoked");
  try {
    Login.login(req.body)
      .then(data => {
        logger.debug(data);
        res.set("session", data.jwt);
        res.cookie("jwt", data.jwt);
        res.status(204);
        res.json({ status: "Login successfull" });
      })
      .catch(err => {
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
  const sessionJWT = req.header("session");
  logger.debug(`session value ${sessionJWT}`);
  try {
    if (sessionJWT) {
      const data = getData(sessionJWT);
      logger.debug(`Data from jwt ${JSON.stringify(data)}`);
      res.json({ username: data.username });
    } else {
      res.status(404);
      res.send();
    }
  } catch (err) {
    logger.error(err);
    res.status(500);
    res.json(err);
  }
};
