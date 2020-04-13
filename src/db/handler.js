import { connect, connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { initializeLogger } from "../utils/logger";

const logger = initializeLogger("handler-js");

/**
 * Connect to the in-memory database.
 */
export async function connectDatabase() {
  let uri =
    process.env.ENV === "prod"
      ? process.env.MONGO_ONLINE_URL.replace(
          "<username>",
          process.env.MONGO_CREDS.SUPER.USERNAME
        )
          .replace("<password>", process.env.MONGO_CREDS.SUPER.PASSWORD)
          .replace("<dbname>", process.env.DB_NAME)
      : undefined;

  try {
    if (process.env.ENV === "dev") {
      logger.debug("Connecting to local DB");
      const mongod = new MongoMemoryServer({
        instance: { port: 53005, dbName: process.env.DB_NAME },
      });
      uri = await mongod.getConnectionString();
    }

    const mongooseOpts = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    };

    await connect(uri, mongooseOpts);
    logger.debug(`connected to db at ${uri}`);
  } catch (err) {
    logger.err("Unable to connect to DB");
    logger.error(err);
  }
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
