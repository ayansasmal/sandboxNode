import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";
import Role from "../models/role";
import LocaleDate from "../../utils/dateUtil";

const logger = initializeLogger("role-operations-js");

mongoose.Promise = global.Promise;

const create = async (name, description) => {
  logger.debug(
    `Creating and saving new role ${name} with description: "${description}"`
  );
  return new Role({
    name,
    description,
    createdBy: "Ayan",
    createdOn: LocaleDate,
  }).save();
};

const fetchAll = async () => {
  logger.debug("Reading all the Tasks");
  return new Promise((resolve, reject) => {
    Role.find({}, (err, data) => {
      if (data) {
        logger.debug(`Fetched roles ${JSON.stringify(data)}`);
        resolve(data);
      }
      logger.error(`unable to fetch roles due to ${JSON.stringify(err)}`, err);
    });
  });
};

const fetch = async (role) => {
  logger.debug(`"Fetching roles with ${role}"`);
  return new Promise((resolve, reject) => {
    Role.find({ name: role }, (err, data) => {      
      logger.debug(`Found data ${JSON.stringify(data)}`);
      if (data) {
        resolve(data);
      }
      logger.error(
        `unable to fetch roles due to ${
          JSON.stringify(err) | JSON.stringify(role)
        }`
      );
      reject({status:"Error",message:"No roles found"});
    });
  });
};

const isValidRole = async (role) => {
  logger.debug(`Trying to validate ${JSON.stringify(role)}`);
  return new Promise((resolve, reject) => {
    Role.findOne(role, (err, data) => {
      if (data) {
        resolve(true);
      }
      resolve(false);
    });
  });
};

const deleteRole = async (role) => {
  logger.debug(`Trying to delete role ${role}`);
  return new Promise((resolve, reject) => {
    Role.findOneAndDelete({name:role},(err, res)=> {
      if(res){
        resolve(res);
      }
      logger.error(`Unable to delete role ${role}`);
      reject({status:"error", message:`Unable to delete ${role} due to ${JSON.stringify(err)}`});
    })
  });
}

export default { create, fetchAll, fetch, isValidRole, deleteRole };
