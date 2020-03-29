import { connect, connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { initializeLogger } from "../utils/logger";
import { configurations } from "./../config";

const mongod = new MongoMemoryServer({
  instance: { port: 53005, dbName: "dastkar-app" }
});
const logger = initializeLogger("handler-js");

/**
 * Connect to the in-memory database.
 */
export async function connectDatabase() {
  logger.debug(`DB Configuration :: ${process.env.DB_SRC}`);
  let uri = configurations.MONGO_ONLINE_URL.replace(
    "<username>",
    configurations.MONGO_CREDS.SUPER.USERNAME
  )
    .replace("<password>", configurations.MONGO_CREDS.SUPER.PASSWORD)
    .replace("<dbname>", configurations.DB_NAME);

  if (
    process.env.DB_SRC &&
    process.env.DB_SRC === configurations.LOCAL_SWITCH_KEYWORD
  ) {
    logger.debug("Connecting to local DB");
    uri = await mongod.getConnectionString();
  }

  const mongooseOpts = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  };

  await connect(uri, mongooseOpts);
  logger.debug(`connected to db at ${uri}`);
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
