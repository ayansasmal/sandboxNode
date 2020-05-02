import Roles from "../../db/operations/roles";
import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("roles-controller");

export const createRole = async (req, res) => {
  logger.debug("Trying to create role");
  logger.debug(`Request data :: ${JSON.stringify(req.body)}`);
  try {
    const existingRoles = await Roles.fetch(req.body.name);
    logger.debug(`Exisiting roles response ${JSON.stringify(existingRoles)}`);
    if (existingRoles.length === 0) {
      const createdRole = await Roles.create(
        req.body.name,
        req.body.description
      );
      logger.debug(`Created role ${createdRole}`);
      res.status(201);
      res.json({ status: "success", message: "Role created successfully" });
    } else {
      res.status(400).json({
        status: "error",
        message: "Cannot create role, as this already existis",
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ status: "error", message: "Unable to create role" });
  }
};

export const fetchAllRoles = async (req, res) => {
  logger.debug("Fetching all the roles");
  try {
    const allRoles = await Roles.fetchAll();
    logger.debug(`All fetched roles ${JSON.stringify(allRoles)}`);
    if (allRoles.length >= 1) res.status(200).json(allRoles);
    else res.status(404).json({ status: "error", message: "No roles found" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ status: "error", message: "Unable to fetch role" });
  }
};

export const fetchRole = async (req, res) => {
  logger.debug(`Trying to find role : ${req.params.rolename}`);
  try {
    const roles = await Roles.fetch(req.params.rolename);
    logger.debug(`fetched roles ${JSON.stringify(roles)}`);
    if (roles.length !== 0) res.status(200).json(roles[0]);
    else res.status(404).json({ status: "error", message: "No roles found" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ status: "error", message: "Unable to fetch role" });
  }
};

export const removeRole = async (req, res) => {
  logger.debug(`Trying to delete role ${req.params.rolename}`);
  try {
    const roles = await Roles.fetch(req.params.rolename);
    logger.debug(`fetched roles ${JSON.stringify(roles)}`);
    if (roles.length !== 0) {
      const deleteResponse = await Roles.deleteRole(req.params.rolename);
      logger.debug(`Deleted response ${deleteResponse}`);
      if (deleteResponse) {
        logger.debug(`deleted role ${deleteResponse}`);
        res
          .status(200)
          .json({ status: "success", message: "Deleted successfuly" });
      }
    } else {
      logger.error("No Role found by the name");
      res.status(400).json({ status: "error", message: "No role found" });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ status: "error", message: "Unable to delete role" });
  }
};
