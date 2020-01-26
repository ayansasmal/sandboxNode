import express from "express";
import { createServer } from "http";
import { connectDatabase } from "./db/handler";
import { initializeLogger } from "./utils/logger";
import { OpenApiValidator } from "express-openapi-validator";
import YAML from "yamljs";
import { connector } from "swagger-routes-express";
import api from "./api";

const logger = initializeLogger("app-js");

logger.info("Server is up and running");

const app = express();
app.use(express.json());
app.disable("x-powered-by");

const loadRoutes = async app => {
  const apiSpec = YAML.load("./src/config/swagger.yaml");
  const connect = connector(api, apiSpec, {
    onCreateRoute: (method, descriptor) => {
      logger.debug(`Interface created : ${method} ${descriptor}`);
    }
  });
  connect(app);
  return app;
};

new OpenApiValidator({
  apiSpec: "./src/config/swagger.yaml",
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
      const port = process.env.PORT || 8080;
      createServer(app).listen(port, () => {
        logger.debug("Server is up and running");
        connectDatabase();
      });
    });
  });
