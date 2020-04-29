import Users from "../../db/operations/user";
import { initializeLogger } from "../../utils/logger";
import login from "../../db/operations/login";

const logger = initializeLogger("user-controller");

export const createUser = async (req, res) => {
  logger.debug("Create user");
  try {
    // if (!req.body || !req.body.identifier) {
    //   throw new Error('Request Body cannot be empty or null');
    // }
    const isAvailable = await checkIfUsernameIsAvailable(req, res);
    if (isAvailable) {
      const id = await createAvailableUsername(req, res);
      logger.debug(`ID of created User ${id}`)
      if (id) {
        const createCreds = await login.createLoginCreds({
          username: req.body.identifier.username,
          email: req.body.identifier.email,
          password: req.body.password
        });
        logger.debug(`Created login creds ${JSON.stringify(createCreds)}`);
        res.status(201);
        res.json({ status: `User created with id ${id}` });
      } else {
        res.status(400);
        res.json({ status: "error", message: "Username is not available" });
      }

    } else {
      res.status(400);
      res.json({ status: "error", message: "Username is not available" });
    }

  } catch (err) {
    logger.error('Unable to create user', err);
    res.status(400);
    res.json(err);
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
    return true;

  } else {
    logger.error(
      `Unable to create user ${req.body.identifier.username} as it exists`
    );
    return false;
  }
};

const createAvailableUsername = async (req, res) => {
  try {
    const createdUser = await Users.create(req.body);
    logger.debug(`${JSON.stringify(createdUser)}`);
    logger.debug(`Created User with id ${createdUser._id}`);
    return createdUser._id;
  } catch (err) {
    logger.error(`Unable to create user ${JSON.stringify(err)}`);
    return false;
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
    const user = await Users.retrieveUser({"identifier.username":req.params.username});
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
