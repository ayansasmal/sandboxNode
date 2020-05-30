import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { connectDatabase } from "./db/handler";
import { initializeLogger, setMessageId } from "./utils/logger";
import { OpenApiValidator } from "express-openapi-validator";
import { connector } from "swagger-routes-express";

import { readHeaders, username, getRoles } from "./utils/headerUtils";

import AuditEvent from "../src/db/operations/audit";

import api from "./api";
import { v4 as uuidv4 } from "uuid";

const logger = initializeLogger("app-js");

const app = express();
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.disable("x-powered-by");

const securityCheckExclusion = ["/login", "/audit", "/whoami", "/healthcheck"];

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

const populateMessageId = async (req, res) => {
  logger.debug(`generating message id for ${req.url}`);
  const messageId = uuidv4();
  setMessageId(messageId);
  res.header("messageId", messageId);
};

app.use(async (req, res, next) => {
  logger.debug(`in middleware for ${req.url}`);
  const headers = await readHeaders(req);
  await populateMessageId(req, res);
  const excluded = await isExcluded(req);
  logger.debug(`${req.url} isExcluded ${excluded}`);
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorisation");
  if (excluded) {
    next();
  } else {
    logger.debug("Validating the username");
    logger.debug(`All the headers for ${username}, ${JSON.stringify(headers)}`);
    await proceedWithUserValidation(next, req, res);
  }
});

const roleMiddleware = async (req, res, next) => {
  logger.debug("in role-middleware");
  const requiredRole = req.openapi.schema["x-role"];
  const rolesInHeader = await getRoles(req);
  logger.debug(
    `'Role updated in request ${JSON.stringify(
      requiredRole
    )}' && from header ${JSON.stringify(rolesInHeader)}`
  );
  if (requiredRole) {
    req.role = requiredRole;
    let isRolePresent = false;
    requiredRole.forEach((role) => {
      if (rolesInHeader.includes(role)) {
        logger.debug(`Found role ${role}`);
        isRolePresent = true;
      }
    });
    if (!isRolePresent) {
      logger.error("Role not present");
      res.status(403).json({ status: "error", message: "Unauthorised access" });
      return;
    }
  }
  next();
};

const loadRoutes = async (app) => {
  const connect = connector(api, swaggerSpec, {
    onCreateRoute: (method, descriptor) => {
      // logger.debug(`Interface created : ${method} ${descriptor[0]} ${descriptor[2]} `);
    },
    middleware: {
      roleMiddleware,
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
async function proceedWithUserValidation(next, req, res) {
  if (username && username !== "anonymous") {
    next();
  } else {
    await AuditEvent.createAudit("Failed security check", {
      body: JSON.stringify(req.body),
      uri: req.path,
    });
    res.set("Content-Type", "application/json");
    res.status(403);
    res.end();
  }
}
