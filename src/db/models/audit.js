import mongoose from "mongoose";
import { initializeLogger } from "./../../utils/logger";

const logger = initializeLogger("audit-js");
const AuditSchema = new mongoose.Schema(
  {
    interaction: {
      type: String
    },
    executedBy: {
      type: String
    },
    data: {
      type: String
    }
  },
  { timestamps: true }
);

AuditSchema.post("save", async doc => {
  logger.debug(`Saved Audit info ${JSON.stringify(doc)}`);
});

const Audit = mongoose.model("Audit", AuditSchema);

export default Audit;
