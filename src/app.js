import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { connectDatabase } from "./db/handler";
import { initializeLogger } from "./utils/logger";
import { OpenApiValidator } from "express-openapi-validator";
import { connector } from "swagger-routes-express";

import { readHeaders, username } from "./utils/headerUtils";

import AuditEvent from "../src/db/operations/audit";

import api from "./api";

const logger = initializeLogger("app-js");

const app = express();
app.use(express.json());
app.disable("x-powered-by");

const securityCheckExclusion = ["/login", "/audit"];

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Dastkar Exhibition API", // Title of the documentation
    version: "1.0.0", // Version of the app
    description:
      "This is the swagger specification for Dastkar Exhibition System", // short description of the app
  },
  servers: [
    { url: "http://localhost:8080", description: " Local host server details" },
  ],
};

const options = {
  // import basic swagger config
  swaggerDefinition,
  // path to the API docs
  apis: ["./src/api-interface/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(
  "/api-doc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/audit/:id/history", async (req, res) => {
  const history = await AuditEvent.fetchAudits(req.params.id);
  res.status(200);
  res.json(history);
});

app.use(async (req, res, next) => {
  logger.debug("in middleware");
  const excluded = await isExcluded(req);
  logger.debug(`${req.url} isExcluded ${excluded}`);
  if (excluded) {
    next();
    return;
  }
  const headers = await readHeaders(req);
  logger.debug(`All the headers for ${username}, ${JSON.stringify(headers)}`);
  if (username && username !== "anonymous") {
    next();
  } else {
    await AuditEvent.createAudit("Failed security check", {
      body: JSON.stringify(req.body),
      uri: req.path,
    });
    res.sendStatus(403);
  }
});

const loadRoutes = async (app) => {
  const connect = connector(api, swaggerSpec, {
    onCreateRoute: (method, descriptor) => {
      logger.debug(`Interface created : ${method} ${descriptor[0]}`);
    },
  });
  connect(app);
  return app;
};

const prepareApp = async () => {
  await new OpenApiValidator({
    apiSpec: swaggerSpec,
    validateResponses: true,
    validateRequests: true,
  }).install(app);
  await loadRoutes(app);
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });
  await connectDatabase();
  return app;
};

export default prepareApp();

const isExcluded = async (req) => {
  var isExcluded = false;
  securityCheckExclusion.forEach((excl) => {
    if (!isExcluded && (req.url === excl || req.url.startsWith(excl, 0))) {
      // logger.debug(`found exclusion for ${req.url} ${excl}`);
      isExcluded = true;
    }
  });
  return isExcluded;
};
