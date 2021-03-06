import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import User from "./user";
import { getToken } from "../../utils/jwt";
import Login from "../models/login";
import LocaleDate from "../../utils/dateUtil";
import bcrypt from "bcrypt";

const logger = initializeLogger("login-operations-js");
mongoose.Promise = global.Promise;

const login = (user) => {
  try {
    if (!user) {
      throw new Error("User cannot be undefined");
    }
    logger.debug(`Logging in for the user ${JSON.stringify(user)}`);
    return new Promise(async (resolve, reject) => {
      const fetchedLoginCreds = await fetchLoginCreds({
        username: user.username,
      });
      if (fetchedLoginCreds.length === 1 && fetchedLoginCreds[0]) {
        await validateCredentialsForLogin(
          fetchedLoginCreds,
          user,
          reject,
          resolve
        );
      } else {
        logger.error(
          `Unable to find creds ${JSON.stringify(fetchedLoginCreds)}`
        );
        reject({
          status: "error",
          message: "unable to find credentials for the user",
        });
      }
    });
  } catch (err) {
    logger.error(err);
    reject({ status: "Error", description: err.message });
  }
};

const fetchLoginCreds = async (user) => {
  try {
    if (!user) throw new Error("credential details cant be null");
    return new Promise((resolve, reject) => {
      logger.debug(`Searching for ${JSON.stringify(user)}`);
      Login.find(user, (err, data) => {
        if (err) {
          logger.error(`Error while searching users ${JSON.stringify(err)}`);
          reject({ status: "error", message: err.message });
        }
        if (data) {
          resolve(data);
        }
      });
    });
  } catch (error) {
    logger.error(`Unable to find user(s)`);
    reject(error);
  }
};

const createLoginCreds = async (login) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!login) throw new Error("Login details cannot be blank");
      logger.debug(`creating the login creds with ${JSON.stringify(login)}`);
      const fetchedCreds = await fetchLoginCreds({ username: login.username });
      if (!fetchedCreds || fetchedCreds.length === 0) {
        logger.debug("found no creds");
        const hashedPassword = await bcrypt.hash(login.password, 10);
        login.password = hashedPassword;
        new Login(login).save((err, data) => {
          if (err) {
            logger.error(err);
            reject({ status: "error", message: "Unable to save login creds" });
          }
          if (data) {
            resolve({
              status: "success",
              message: `User login creds created with ${data._id}`,
            });
          }
        });
      } else {
        logger.error(fetchedCreds);
        reject({ status: "error", message: "Existing user details found" });
      }
    } catch (error) {
      logger.error(`Unable to create user login creds`, error);
      reject({ status: "error", message: error.message });
    }
  });
};

const updateLoginCreds = async (loginCreds) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!loginCreds) throw new Error("Invalid login credentials");
      const fetchedLoginCreds = await fetchLoginCreds({
        username: loginCreds.username,
      });
      if (fetchedLoginCreds.length === 1 && fetchedLoginCreds[0]) {
        const isValid = await validateCredentialsForUpdate(
          fetchedLoginCreds,
          loginCreds,
          reject
        );
        if (isValid) {
          const hashedPassword = await bcrypt.hash(loginCreds.newPassword, 10);
          await Login.updateOne(
            { username: loginCreds.username },
            { password: hashedPassword }
          );
          resolve({
            status: "success",
            message: "password updated successfully",
          });
        } else {
          reject({ status: "error", message: "invalid password" });
        }
      } else {
        logger.error(
          `Unable to find creds ${JSON.stringify(fetchedLoginCreds)}`
        );
        reject({
          status: "error",
          message: "unable to find credentials for the user",
        });
      }
    } catch (err) {
      logger.error(err);
      reject({ status: "Error", description: err.message });
    }
  });
};

const deleteLoginCreds = async (username) => {
  logger.debug(`'Trying to delete ${username}'`);
  return new Promise((resolve, reject) => {
    Login.findOneAndDelete({username}, (err, res) => {
      if(err){
        logger.error(`'Unable to remove the login credentials for ${username}'`, err);
        reject(err)
      }
      if(res){
        logger.debug(`login creds deleted ${JSON.stringify(res)}`);
        resolve(res);
      } 
      logger.debug(`Unable to find any user`);
      reject({status:"error", message:`"unable to find login creds for ${username}"`})
    })
  })

};

export default { login, fetchLoginCreds, createLoginCreds, updateLoginCreds, deleteLoginCreds };

async function validateCredentialsForLogin(
  fetchedLoginCreds,
  user,
  reject,
  resolve
) {
  const isValid = await validatePasswords(
    fetchedLoginCreds,
    user.password,
    reject
  );
  logger.debug(`isValid ${JSON.stringify(isValid)}`);
  if (isValid) {
    await getLoginResponse(user, resolve, reject);
    const updatedLoginCreds = await Login.updateOne(
      { username: user.username },
      { isLoggedIn: true, lastLoggedIn: LocaleDate }
    );
    logger.debug(`Updated creds ${JSON.stringify(updatedLoginCreds)}`);
  } else {
    logger.error(`invalid response ${JSON.stringify(isValid)}`);
    reject({ status: "error", message: "invalid credentials" });
  }
}

async function validateCredentialsForUpdate(
  fetchedLoginCreds,
  loginCreds,
  reject
) {
  const isValid = await validatePasswords(
    fetchedLoginCreds,
    loginCreds.oldPassword,
    reject
  );
  logger.debug(`isValid ${JSON.stringify(isValid)}`);
  if (isValid) {
    const hashedPassword = await bcrypt.hash(loginCreds.newPassword, 10);
    const updatedLoginCreds = await Login.updateOne(
      { username: loginCreds.username },
      { password: hashedPassword }
    );
    logger.debug(`Updated creds ${JSON.stringify(updatedLoginCreds)}`);
    return true;
  } else {
    logger.error(`invalid response ${JSON.stringify(isValid)}`);
    return false;
  }
}

async function validatePasswords(fetchedLoginCreds, password, reject) {
  logger.debug(`Found login creds ${JSON.stringify(fetchedLoginCreds)}`);
  if (fetchedLoginCreds[0].password && password) {
    logger.debug("validating provided password");
    const isValid = await bcrypt.compare(
      password,
      fetchedLoginCreds[0].password
    );
    if (isValid) {
      return true;
    } else {
      reject({ status: "error", message: "Password mismatch" });
      return false;
    }
  }
  return false;
}

async function getLoginResponse(user, resolve, reject) {
  try {
    logger.debug("Passwords match");
    const userDetails = await User.retrieveUser({
      "identifier.username": user.username,
    });
    logger.debug(`User details ${JSON.stringify(userDetails)}`);
    if (userDetails && userDetails.records.length === 1) {
      const detail = {};
      const identifier = userDetails.records[0].identifier;
      detail.username = identifier.username;
      detail.firstname = identifier.firstName;
      detail.lastname = identifier.lastName;
      detail.email = identifier.email;
      detail.mobileNumber = identifier.mobileNumber;
      detail.role = userDetails.records[0].role;
      logger.debug(`Details ${JSON.stringify(detail)}`);
      resolve({
        data: detail,
        jwt: getToken(detail, true),
      });
      return true;
    } else {
      reject({
        status: "error",
        message: "Multiple or no  users found",
      });
      return false;
    }
  } catch (error) {
    logger.error(error);
    reject({ status: "error", message: error.message });
    return false;
  }
}
