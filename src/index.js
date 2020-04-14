import app from "./app";
import { createServer } from "http";
import { initializeLogger } from "../src/utils/logger";

const logger = initializeLogger("index-js");
const port = process.env.PORT || 8080;
const setupServer = async () => {
  const appServer = await app;

  createServer(appServer).listen(port, () => {
    logger.debug("Server is up and running");
  });
};

setupServer();
