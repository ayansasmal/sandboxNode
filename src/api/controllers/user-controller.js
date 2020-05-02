import Users from "../../db/operations/user";
import login from "../../db/operations/login";
import { initializeLogger } from "../../utils/logger";

import bcrypt from "bcrypt";
import _ from "lodash";

const logger = initializeLogger("user-controller");

export const createUser = async (req, res) => {
  logger.debug("Create user");
  try {
    const isAvailable = await checkIfUsernameIsAvailable(req, res);
    if (isAvailable) {
      const id = await createAvailableUsername(req, res);
      logger.debug(`ID of created User ${id}`);
      if (id) {
        const createCreds = await login.createLoginCreds({
          username: req.body.identifier.username,
          email: req.body.identifier.email,
          password: req.body.password,
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
    logger.error("Unable to create user", err);
    res.status(400);
    res.json(err);
  }
};

const checkIfUsernameIsAvailable = async (req, res) => {
  const isUserNameAvailable = await Users.isUsernameAvailable({
    "identifier.username": req.body.identifier.username,
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
  const newDetail = req.body;
  logger.debug(
    `Updating the user ${req.params.username} ${JSON.stringify(newDetail)}`
  );
  //fetch the user
  const users = await Users.retrieveUser({
    "identifier.username": req.params.username,
  });
  const existingDetail = users.records[0];
  logger.debug(`Existing details ${JSON.stringify(existingDetail)}`);
  // translate the new information
  const updatedDetail = translateDetails(newDetail, existingDetail);

  //update the user details in user table
  const updatedRecord = await Users.update(req.params.username, updatedDetail);
  logger.debug(`Updated doc ${JSON.stringify(updatedRecord)}`);

  if (newDetail.password) {
    //update login details
    await updateCredentials(req, newDetail, res);
  } else {
    res.status(201).json({
      status: "success",
      message: "User details updated successfully",
    });
  }

  res.status(501).send();
};

export const removeUser = async (req, res) => {
  logger.debug(`Removing user ${JSON.stringify(req.body)}`);
};

export const fetchUser = async (req, res) => {
  logger.debug(`Finding user ${JSON.stringify(req.params)}`);
  try {
    const user = await Users.retrieveUser({
      "identifier.username": req.params.username,
    });
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

async function updateCredentials(req, newDetail, res) {
  const loginDetails = await login.fetchLoginCreds({
    username: req.params.username,
  });
  logger.debug(`Fetched Login details ${JSON.stringify(loginDetails)}`);
  //validate if password match
  const isValidPassword = await bcrypt.compare(
    newDetail.oldPassword,
    loginDetails[0].password
  );
  logger.debug(`'Password is valid ?? ' ${isValidPassword}`);
  if (isValidPassword) {
    //update the login credentials
    const loginUpdateStatus = await login.updateLoginCreds({
      username: req.params.username,
      oldPassword: newDetail.oldPassword,
      newPassword: newDetail.password,
    });
    if (loginUpdateStatus.status === "success") {
      logger.debug("All good so far! Updated Login details");
      res.status(201).json({
        status: "success",
        message: "User details updated successfully",
      });
    }
  } else {
    res.status(403).send();
  }
}

function translateDetails(newDetail, existingDetail) {
  const newIdentifier = newDetail.identifier;
  const existingIdentifier = existingDetail.identifier;
  const updatedDetail = {};
  updatedDetail.identifier = existingIdentifier;
  updatedDetail.role = existingDetail.role;
  if (newIdentifier != {}) {
    logger.debug(
      `${JSON.stringify(newIdentifier)} -> ${JSON.stringify(
        existingIdentifier
      )}`
    );

    if (newIdentifier.email)
      updatedDetail.identifier.email = newIdentifier.email;
    if (newIdentifier.firstName)
      updatedDetail.identifier.firstName = newIdentifier.firstName;
    if (newIdentifier.lastName)
      updatedDetail.identifier.lastName = newIdentifier.lastName;
    if (newIdentifier.mobileNumber)
      updatedDetail.identifier.mobileNumber = newIdentifier.mobileNumber;
  }
  if (newDetail.role) {
    updatedDetail.role = newDetail.role;
  }
  return updatedDetail;
}
