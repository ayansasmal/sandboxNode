import jwt from "jsonwebtoken";
import { initializeLogger } from "./logger";

export const logger = initializeLogger("jwt-utils");

const pwd = "ayansasmalisthecreatorofappli";
export const getToken = (data, isSigned) => {
  return jwt.sign(data, pwd);
};

export const getData = (token, isSigned) => {
  try {
    logger.debug("checking jwt");
    return jwt.verify(token, pwd);
  } catch (err) {
    logger.error(`Error ${typeof err} :: ${err.name} ${err.message}`);
    throw err;
  }
};
