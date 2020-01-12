import express from "express";
import { createServer } from "http";
import { connectDatabase } from "./db/handler";
import { initializeLogger } from "./utils/logger";
import { OpenApiValidator } from "express-openapi-validator";
import YAML from "yamljs";
import { connector } from "swagger-routes-express";
import api from "./api";
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

/* 

const app = express();
app.use(express.json());

const loadRoutes = async app => {
  const apiSpec = YAML.load("./config/swagger.yaml");
  const connect = connector(api, apiSpec, {
    onCreateRoute: (method, descriptor) => {
      console.log(`Interface created : ${method} ${descriptor[0]}`);
    }
  });
  connect(app);
  return app;
};

new OpenApiValidator({
  apiSpec: "./config/swagger.yaml",
  validateResponses: true,
  validateRequests: true
})
  .install(app)
  .then(() => {
    loadRoutes(app).then(() => {
      app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
          message: err.message,
          errors: err.errors
        });
      });
      createServer(app).listen(3000, () => {
        console.log("Server is up and running");
      });
    });
  });

*/
