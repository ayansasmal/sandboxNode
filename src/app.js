import express from "express";
import { connectDatabase } from "./db/handler";
import { createServer } from "http";
import { initializeLogger } from "./utils/logger";
import taskRoutes from "./routes/task";
import userRoutes from "./routes/user";
import roleRoutes from "./routes/role";
import LocaleDate from "./utils/dateUtil";

import Login from "./db/operations/login";

const logger = initializeLogger("app-js");

logger.info("Server is up and running");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;
//create a server object:
createServer(app).listen(port); //the server object listens on port 8080
connectDatabase();

app.use("/task", taskRoutes);

app.use("/user", userRoutes);

app.use("/role", roleRoutes);

app.get("/", function(req, res) {
  logger.debug("got root");
  res.write(`${LocaleDate.toString()} Server is up and ready to use`);
  res.end(); //end the response
});

app.post("/login", (req, res) => {
  logger.debug(`Logging in ${JSON.stringify(req.body)}`);
  Login.login(req.body)
    .then(data => {
      if (data) {
        logger.debug(`Found user ${JSON.stringify(data)}`);
        res.cookie("session", data.jwt);
        res.send(data);
      }
    })
    .catch(err => {
      logger.error(err);
      res.write(err.description);
      res.status(401);
      res.end();
    });
});

app.get("/logout", (req, res) => {});
