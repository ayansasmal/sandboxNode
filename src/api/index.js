import { initializeLogger } from "../utils/logger";
import { loginUser, whoami } from "./controllers/login-controller";
import {
  createUser,
  removeUser,
  updateUser,
  fetchUser,
  fetchAllUsers,
} from "./controllers/user-controller";
import {
  createRole,
  fetchAllRoles,
  fetchRole,
} from "./controllers/roles-controller";

const logger = initializeLogger("api-index");

const healthCheck = (req, res) => {
  logger.debug("Healthcheck");
  res.json({ status: "The application is up and running" });
};

export default {
  healthCheck,
  loginUser,
  createUser,
  removeUser,
  updateUser,
  fetchUser,
  fetchAllUsers,
  whoami,
  createRole,
  getAllRoles: fetchAllRoles,
  fetchRole,
};
