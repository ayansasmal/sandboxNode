import Users from "../../db/operations/user";
import { initializeLogger } from "../../utils/logger";

import ErrorCode from "../../db/operations/errorCode";

const logger = initializeLogger("user-controller");

export const createUser = async (req, res) => {
  logger.debug("Create user");
  if (req.body) {
    try {
      await checkIfUsernameIsAvailable(req, res);
    } catch (err) {
      logger.error(err);
      res.status(400);
      res.json(err);
    }
  }
};

const checkIfUsernameIsAvailable = async (req, res) => {
  const isUserNameAvailable = await Users.isUsernameAvailable({
    "identifier.username": req.body.identifier.username
  });
  logger.debug(JSON.stringify(isUserNameAvailable));
  if (isUserNameAvailable.status === "success") {
    logger.debug(
      `User name is valid and available ${JSON.stringify(isUserNameAvailable)}`
    );
    await createAvailableUsername(req, res);
  } else {
    logger.error(
      `Unable to create user ${req.body.identifier.username} as it exists`
    );
    res.status(400);
    res.json(isUserNameAvailable);
  }
};

const createAvailableUsername = async (req, res) => {
  try {
    const createdUser = await Users.create(req.body);
    logger.debug(`${JSON.stringify(createdUser)}`);
    logger.debug(`Created User with id ${createdUser._id}`);
    res.status(201);
    res.json({ status: `User created with id ${createdUser._id}` });
  } catch (err) {
    logger.error(`Unable to create user ${JSON.stringify(err)}`);
    res.status(400);
    res.json(err);
  }
};

export const updateUser = async (req, res) => {
  logger.debug(req.params);
  logger.debug(`Updating the user ${JSON.stringify(req.body)}`);
};

export const removeUser = async (req, res) => {
  logger.debug(`Removing user ${JSON.stringify(req.body)}`);
};

export const fetchUser = async (req, res) => {
  logger.debug(`Finding user ${JSON.stringify(req.body)}`);
};

export const fetchAllUsers = async (req, res) => {
  logger.debug(`Fetch all users`);
};
