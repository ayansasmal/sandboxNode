import app from "../../src/app";
import request from "supertest";
import { initializeLogger } from "../../src/utils/logger";
import { closeDatabase } from "../../src/db/handler";

// models
import login from "../../src/db/models/login";
import { logger } from "../../src/utils/jwt";

const testLogger = initializeLogger("login-test-js");

beforeEach(async () => {});

afterEach(async () => {
  await closeDatabase();
});

test("Testing login controller", () => {
  testLogger.debug("in login controller");
});

test("User controller test", async () => {
  const appServer = await app;
  await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmal",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set(
      "session",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await login.find({}, (err, data) => {
    if (err) {
      logger.error("Unable to fetch details from Login");
    }
    if (data) {
      logger.debug(`Data :: ${JSON.stringify(data)}`);
    }
  });
});
