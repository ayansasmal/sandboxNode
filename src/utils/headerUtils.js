import { initializeLogger } from "./logger";
import { getData } from "./jwt";

const logger = initializeLogger("header-utils-js");

let roles;
export let headers,
  username = "anonymous";

export const readHeaders = async (req) => {
  logger.debug(`Reading headers ${JSON.stringify(req.headers)}`);
  headers = req.headers;
  readUserName(req.header("Authorization"));
  return headers;
};

export const getAuth = () => {
  if (headers && headers["Authorization"]) {
    const auth = headers["Authorization"];
    logger.debug(`Authorization Header ${auth}`);
    return auth;
  } else {
    return undefined;
  }
};

export const getRoles = async (req) => {
  if (!roles) {
    await readHeaders(req);
  }
  logger.debug(`Found Roles ${JSON.stringify(roles)}`);
  return roles;
};

const readUserName = (authJWT) => {
  logger.debug(`checking who is logged in using session JWT :: ${authJWT}`);
  try {
    if (authJWT) {
      const data = getData(authJWT);
      logger.debug(`Data from jwt ${JSON.stringify(data)}`);
      username = data.username;
      roles = data.role;
    } else {
      username = "anonymous";
    }
    return username;
  } catch (err) {
    logger.error("Unable to fetch user name", err);
  }
};
