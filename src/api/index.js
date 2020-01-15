import { initializeLogger } from "../utils/logger";
import { loginUser, whoami } from "./controllers/login-controller";
import { createUser } from "./controllers/user-controller";

const logger = initializeLogger("api-index");

const healthCheck = (req, res) => {
  logger.debug("Healthcheck");
  res.json({ status: "The application is up and running" });
};

export default { healthCheck, loginUser, createUser, whoami };
