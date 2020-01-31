import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { createServer } from "http";
import { connectDatabase } from "./db/handler";
import { initializeLogger } from "./utils/logger";
import { OpenApiValidator } from "express-openapi-validator";
import { connector } from "swagger-routes-express";
import api from "./api";

const logger = initializeLogger("app-js");

logger.info("Server is up and running");

const app = express();
app.use(express.json());
app.disable("x-powered-by");

const swaggerDefinition = {
  openapi: "3.0.2",
  info: {
    title: "Dastkar Exhibition API", // Title of the documentation
    version: "1.0.0", // Version of the app
    description:
      "This is the swagger specification for Dastkar Exhibition System" // short description of the app
  }
};

const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: [
    "./src/config/partials/login-api.yaml",
    "./src/config/partials/users-api.yaml",
    "./src/config/partials/roles-api.yaml"
  ]
};

const swaggerSpec = swaggerJSDoc(options);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.get("/swagger.json", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const loadRoutes = async app => {
  const connect = connector(api, swaggerSpec, {
    onCreateRoute: (method, descriptor) => {
      logger.debug(`Interface created : ${method} ${descriptor}`);
    }
  });
  connect(app);
  return app;
};

new OpenApiValidator({
  apiSpec: swaggerSpec,
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
