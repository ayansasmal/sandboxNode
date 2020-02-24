import Roles from "../../db/operations/roles";
import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("roles-controller");

export const createRole = (req, res) => {
  logger.debug("Trying to create role");
  Roles.exists({ name: req.body.name })
    .then(exists => {
      if (exists) {
        res.status(400);
        res.json({ message: "Cannot create role, as this already existis" });
      } else {
        Roles.create(req.body.name, req.body.description)
          .then(data => {
            res.status(201);
            res.json({ status: `Role created with id ${data._id}` });
          })
          .catch(err => {
            res.status(400);
            res.json({ message: `Unable to create role ${err}` });
          });
      }
    })
    .catch(err => {
      logger.error(err);
      res.status(500);
      res.send(err.message);
    });
};

export const fetchAllRoles = (req, res) => {
  logger.debug("Fetching all the roles");
  Roles.fetchAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500);
      res.send(err);
    });
};

export const fetchRole = (req, res) => {
  logger.debug(`Trying to find role : ${req.body}`);
  Roles.fetch(req.params.role)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500);
      res.send(err);
    });
};
