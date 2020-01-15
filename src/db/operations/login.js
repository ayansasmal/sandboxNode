import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import User from "./user";
import password from "../../utils/password";
import { getToken } from "../../utils/jwt";

const logger = initializeLogger("login-operations-js");
mongoose.Promise = global.Promise;

const login = user => {
  return new Promise((resolve, reject) => {
    try {
      User.verify({
        "identifier.username": user.username
      })
        .then(data => {
          logger.debug(
            `Found user. ${data.identifier.username}, ${data.iv}, ${data.password}`
          );
          if (data.iv && data.password && user.password) {
            if (
              password.encrypt(user.password, data.iv).encryptedData ===
              data.password
            ) {
              logger.debug("password match");
              resolve({
                data: {
                  username: data.identifier.username,
                  firstname: data.identifier.firstName,
                  lastname: data.identifier.lastName,
                  lastLoggedIn: data.lastLoggedIn,
                  roles: data.role
                },
                jwt: getToken(
                  {
                    username: data.identifier.username,
                    firstname: data.identifier.firstName,
                    lastname: data.identifier.lastName,
                    lastLoggedIn: data.lastLoggedIn,
                    roles: data.role
                  },
                  true
                )
              });
            } else {
              reject({ status: "Error", description: "Password mismatch" });
            }
          } else {
            reject({ status: "Error", description: "username mismatch" });
          }
        })
        .catch(err => {
          logger.error(err);
          reject(err);
        });
    } catch (err) {
      logger.error(err);
      reject({ status: "Error", description: err.message });
    }
  });
};

export default { login };
