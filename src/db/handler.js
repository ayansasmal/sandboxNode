import { connect, connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { initializeLogger } from "../utils/logger";

const mongod = new MongoMemoryServer();
const logger = initializeLogger("handler-js");

/**
 * Connect to the in-memory database.
 */
export async function connectDatabase() {
  logger.debug(`DB Configuration :: ${process.env.DB_SRC}`);

  let uri =
    "mongodb+srv://super-user:super-user-mongo-ayan@maincluster-cmwtk.mongodb.net/task-manager?retryWrites=true&w=majority";

  if (process.env.DB_SRC && process.env.DB_SRC === "local") {
    logger.debug("Connecting to local DB");
    uri = await mongod.getConnectionString();
  }

  const mongooseOpts = {
    useUnifiedTopology: true,
    useNewUrlParser: true
  };

  await connect(uri, mongooseOpts);
  logger.debug("connected to db");
}

/**
 * Drop database, close the connection and stop mongod.
 */
export async function closeDatabase() {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
}

/**
 * Remove all the data for all db collections.
 */
export async function clearDatabase() {
  const collections = connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}
