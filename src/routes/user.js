import { Router } from "express";
import Users from "../db/operations/user";
import { initializeLogger } from "../utils/logger";

const router = Router();

const logger = initializeLogger("user-route-js");

router.post("/create", function(req, res) {
  logger.debug("Trying to create user");
});

router.get("/", function(req, res) {
  logger.debug("Trying to create user");
});

export default router;
