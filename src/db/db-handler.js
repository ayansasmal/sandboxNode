import { connect, connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { initializeLogger } from "../utils/logger";

const mongod = new MongoMemoryServer();
const logger = initializeLogger("db-handler-js");

/**
 * Connect to the in-memory database.
 */
export async function connectDatabase() {
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };

  await connect(
    uri,
    mongooseOpts
  );
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
