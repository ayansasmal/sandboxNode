import { Router } from "express";
import Roles from "../db/operations/roles";
import { initializeLogger } from "../utils/logger";

const router = Router();

const logger = initializeLogger("user-route-js");

router.post("/", function(req, res) {
  logger.debug("Trying to create user");
});

router.get("/", function(req, res) {
  logger.debug("Trying to create user");
});

export default router;
