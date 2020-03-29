import Users from "../../db/operations/user";
import { initializeLogger } from "../../utils/logger";
import login from "../../db/operations/login";

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
    const createCreds = await login.createLoginCreds({
      username: req.body.identifier.username,
      email: req.body.identifier.email,
      password: req.body.password
    });
    logger.debug(`Created login creds ${createCreds}`);
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
  logger.debug(
    `Updating the user ${req.params.username} ${JSON.stringify(req.body)}`
  );
};

export const removeUser = async (req, res) => {
  logger.debug(`Removing user ${JSON.stringify(req.body)}`);
};

export const fetchUser = async (req, res) => {
  logger.debug(`Finding user ${JSON.stringify(req.params)}`);
  try {
    const user = await Users.retrieveUser({});
    logger.debug(`Fetched user ${JSON.stringify(user)}`);
    res.status(200);
    res.json(user.records[0]);
  } catch (err) {
    logger.error(`Unable to fetch user ${JSON.stringify(err)}`);
    res.status(400);
    res.json(err);
  }
};

export const fetchAllUsers = async (req, res) => {
  logger.debug(`Fetch all users`);
  try {
    const users = await Users.retrieveUser({});
    logger.debug(`Fetched users ${JSON.stringify(users)}`);
    res.status(200);
    res.json(users.records);
  } catch (err) {
    logger.error(`Unable to fetch users ${JSON.stringify(err)}`);
    res.status(400);
    res.json(err);
  }
};
