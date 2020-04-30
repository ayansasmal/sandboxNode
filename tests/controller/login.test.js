import app from "../../src/app";
import bcrypt from "bcrypt";
import request from "supertest";
import { initializeLogger } from "../../src/utils/logger";
import { closeDatabase, clearDatabase } from "../../src/db/handler";

// models
import login from "../../src/db/models/login";
import loginOperation from "../../src/db/operations/login";

const testLogger = initializeLogger("login-test-js");

let appServer;

const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLXVzZXItY3JlYXRlIiwiZGFzdGthci1hcHAtYWRtaW4iXSwiaWF0IjoxNTg4MjM0MTE4fQ.VweZblvaVSgfi0z2CUdIRqAaVWouW4SQ406_lKlYwjU";

beforeAll(async () => {
  appServer = await app;
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

afterEach(() => {});

/*

*/

test("Test to check login details", async () => {
  testLogger.debug("Test to check login details...");
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
      "authorization",
      authorization
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await login.find({}, async (err, data) => {
    if (err) {
      testLogger.error("Unable to fetch details from Login");
    }
    if (data) {
      testLogger.debug(`Data :: ${JSON.stringify(data)}`);
      const loginCreds = data[0];
      testLogger.debug(`Login Creds :: ${JSON.stringify(loginCreds)}`);
      expect(loginCreds.username).toBe("ayansasmal");
      const isValidPassword = await bcrypt.compare(
        "ayansasmal",
        loginCreds.password
      );
      expect(isValidPassword).toBe(true);
    }
  });
});

test("Test to check login details with invalid password", async () => {
  testLogger.debug("Test to check login details...");
  await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmal1",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "password",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set(
      "authorization",
      authorization)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to check if login is valid", async () => {
  testLogger.debug("Test to check if login is valid...");
  await request(appServer)
    .post("/login")
    .send({ username: "ayansasmal", password: "ayansasmal" })
    .set("Accept", "application/json")
    .expect(204);
});

test("Test to check if login is valid with blank inputs", async () => {
  testLogger.debug("Test to check if login is valid...");
  await request(appServer)
    .post("/login")
    .send({ username: "", password: "123" })
    .set("Accept", "application/json")
    .expect(500);
});

test("Test to check if login is invalid with incorrect password", async () => {
  testLogger.debug("Test to check if login is valid...");
  await request(appServer)
    .post("/login")
    .send({ username: "ayansasmal", password: "ayansasmal1" })
    .set("Accept", "application/json")
    .expect(403);
});

test("Test to check if login is invalid with blank password", async () => {
  testLogger.debug("Test to check if login is valid...");
  await request(appServer)
    .post("/login")
    .send({ username: "ayansasmal", password: "" })
    .set("Accept", "application/json")
    .expect(403);
});

test("Test to check if login is invalid with incorrect username", async () => {
  testLogger.debug("Test to check if login is valid...");
  await request(appServer)
    .post("/login")
    .send({ username: "ayansasmal1", password: "ayansasmal" })
    .set("Accept", "application/json")
    .expect(403);
});

test("Test login operation with no user details", async () => {
  try {
    await loginOperation.login();
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login Model with invalid details", async () => {
  try {
    await new login({ email: "ayan.com" }).save();
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login operation for createLoginCredentials", async () => {
  try {
    await loginOperation.createLoginCreds({ username: "ayansasmal" });
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login operation for createLoginCredentials with blank details", async () => {
  try {
    await loginOperation.createLoginCreds();
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login operation for fetchLoginCedentials with blank details", async () => {
  try {
    await loginOperation.fetchLoginCreds();
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login operation for fetchLoginCedentials with invalid details", async () => {
  try {
    await loginOperation.fetchLoginCreds({ dummy: "name" });
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login operation for updateLoginCreds with valid details", async () => {
  try {
    await loginOperation.updateLoginCreds({
      username: "ayansasmal",
      oldPassword: "ayansasmal",
      newPassword: "ayansasmal1123",
    });
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login operation for updateLoginCreds with invalid old password in details", async () => {
  try {
    await loginOperation.updateLoginCreds({
      username: "ayansasmal",
      oldPassword: "ayansasmal1",
      newPassword: "ayansasmal1123",
    });
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login operation for updateLoginCreds with invalid details", async () => {
  try {
    await loginOperation.updateLoginCreds({
      username: "ayansasmal1",
      oldPassword: "ayansasmal",
      newPassword: "ayansasmal1",
    });
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

test("Test login operation for updateLoginCreds with invalid details", async () => {
  try {
    await loginOperation.updateLoginCreds();
  } catch (err) {
    testLogger.error(`Unable to log in`);
    testLogger.error(err);
  }
});

/*
Whoami interface
*/

test("Test to check who logged in", async () => {
  testLogger.debug("Test to check if login is valid...");
  await request(appServer)
    .get("/whoami")
    .set("Accept", "application/json")
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);
});

test("Negative Test to check who logged in with improper token", async () => {
  testLogger.debug("Test to check if login is valid...");
  await request(appServer)
    .get("/whoami")
    .set("Accept", "application/json")
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(500);
});

test("Neagtive Test to check who logged in with no token", async () => {
  testLogger.debug("Test to check if login is valid...");
  await request(appServer)
    .get("/whoami")
    .set("Accept", "application/json")
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(404);
});
