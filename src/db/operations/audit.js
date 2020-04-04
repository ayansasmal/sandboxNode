import Audit from "../models/audit";
import { initializeLogger } from "../../utils/logger";

import { username } from "../../utils/headerUtils";

const logger = initializeLogger("audit-operations-js");

const createAudit = async (interaction, data) => {
  logger.debug(`creating audit ${JSON.stringify(interaction)}`);
  return new Audit({
    interaction,
    data: sanitizeData(data),
    executedBy: username
  }).save();
};

const sanitizeData = data => {
  if (data && typeof data !== "string") {
    data.password = undefined;
    data.iv = undefined;
  }
  return JSON.stringify(data);
};

const fetchAudits = async id => {
  return new Promise((resolve, reject) => {
    try {
      Audit.find({ executedBy: id }, (err, data) => {
        if (err) {
          reject(err);
        }
        if (data) {
          resolve(data);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export default { createAudit, fetchAudits };
