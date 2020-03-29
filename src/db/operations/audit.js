import Audit from "../models/audit";
import { initializeLogger } from "../../utils/logger";

import { username } from "../../utils/headerUtils";

const logger = initializeLogger("audit-operations-js");

const createAudit = async (interaction, data) => {
  logger.debug(`creating audit ${JSON.stringify(interaction)}`);
  return new Audit({ interaction, data, executedBy: username }).save();
};

const fetchAudits = async () => {
  return new Promise((resolve, reject) => {
    try {
      Audit.find({}, (err, data) => {
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
