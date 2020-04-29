import { initializeLogger } from "./logger";
import { getData } from "./jwt";

const logger = initializeLogger("header-utils-js");

export let headers,
  username = "anonymous";

export const readHeaders = async req => {
  logger.debug(`Reading headers ${JSON.stringify(req.headers)}`);
  headers = req.headers;
  readUserName(req.header("authorization"));
  return headers;
};

export const getAuth = () => {
  if(headers && headers["authorization"]) {
  const auth = headers["authorization"]
  logger.debug(`Authorization Header ${auth}`);
  return auth;
  } else {
    return undefined;
  }
}

const readUserName = sessionJWT => {
  logger.debug(`checking who is logged in using session JWT :: ${sessionJWT}`);
  try {
    if (sessionJWT) {
      const data = getData(sessionJWT);
      logger.debug(`Data from jwt ${JSON.stringify(data)}`);
      username = data.username;
    } else {
      username = "anonymous";
    }
    return username;
  } catch (err) {
    logger.error("Unable to fetch user name", err);
  }
};
