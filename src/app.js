import { createServer } from "http";
import { initializeLogger } from "./utils/logger";
import mongoose from "./db/mongoose";

const logger = initializeLogger("app-js");

//create a server object:
createServer(function(req, res) {
  logger.info("Server is up and running");
  const task = mongoose.createNewTask("New Task created");
  task
    .then(doc => {
      logger.debug(`Saved Document:: ${JSON.stringify(doc)}`);
      res.write(`Server is up and ${doc._id}`);
      res.end(); //end the response
    })
    .catch(err => {
      logger.error(`Unable to save document ${JSON.stringify(err)}`);
      res.write(`Server is up but ${JSON.stringify(err)}`);
      res.end();
    });
}).listen(8080); //the server object listens on port 8080
