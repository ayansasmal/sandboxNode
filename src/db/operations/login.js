import mongoose from "mongoose";
import { initializeLogger } from "../../utils/logger";

const logger = initializeLogger("login-operations-js");
mongoose.Promise = global.Promise;
