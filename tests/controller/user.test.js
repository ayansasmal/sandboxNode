import app from "../../src/app";
import request from "supertest";
import { initializeLogger, getMessageId } from "../../src/utils/logger";
import { closeDatabase, clearDatabase } from "../../src/db/handler";

// models
import UserModel from "../../src/db/models/user";
import UserOperation from "../../src/db/operations/user";

const testLogger = initializeLogger("user-test-js");

let appServer;
let testName;

const authWithBothRoles =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLXVzZXItY3JlYXRlIiwiZGFzdGthci1hcHAtYWRtaW4iXSwiaWF0IjoxNTg4MjM0MTE4fQ.VweZblvaVSgfi0z2CUdIRqAaVWouW4SQ406_lKlYwjU";

const authWithUserRole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLXVzZXItY3JlYXRlIl0sImlhdCI6MTU4ODIzNDExOH0.8DFHMRuUB-3SYiiy1jIveO-TrAd_4YL6lJ9VB1Dxyuk";
const authWithAdminRole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLWFwcC1hZG1pbiJdLCJpYXQiOjE1ODgyMzQxMTh9.GOUlCR8YHGyCgJbA6hyP5Bl7w7LyUSWssSAduvLyQXw";
const authWithNoRightRole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLWFwcC1jcmVhdG9yIl0sImlhdCI6MTU4ODIzNDExOH0._c7gG3AE10II_G8L2C9qx_52as5k6Zq6m3QsCwM2wb8";

beforeAll(async () => {
  // console.log('in User test');
  appServer = await app;
  await clearDatabase();
});

afterEach(async () => {
  testLogger.debug(`"${testName}" was executed with ${getMessageId()}`);
  testName = undefined;
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

/*

*/

test("Test to check User creation", async () => {
  testName = "Test to check User creation";
  testLogger.debug("Test to check User creation...");
  await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmalBoth",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithBothRoles)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await UserModel.find({}, async (err, data) => {
    if (err) {
      testLogger.error("Unable to fetch details from User");
    }
    if (data) {
      testLogger.debug(`Data :: ${JSON.stringify(data)}`);
      const users = data[0];
      testLogger.debug(`User details :: ${JSON.stringify(users)}`);
      expect(users.identifier.username).toBe("ayansasmalBoth");
    }
  });
});

test("Test to check User creation with User Role", async () => {
  testName = "Test to check User creation with User Role";
  testLogger.debug(testName);
  await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmalUser",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await UserModel.find({}, async (err, data) => {
    if (err) {
      testLogger.error("Unable to fetch details from User");
    }
    if (data) {
      testLogger.debug(`Data :: ${JSON.stringify(data)}`);
      const users = data[0];
      testLogger.debug(`User details :: ${JSON.stringify(users)}`);
      expect(users.identifier.username).toBe("ayansasmalUser");
    }
  });
});

test("Test to check User creation with Admin Role", async () => {
  testName = "Test to check User creation with Admin Role";
  testLogger.debug(testName);
  await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmalAdmin",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithAdminRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await UserModel.find({}, async (err, data) => {
    if (err) {
      testLogger.error("Unable to fetch details from User");
    }
    if (data) {
      testLogger.debug(`Data :: ${JSON.stringify(data)}`);
      const users = data[0];
      testLogger.debug(`User details :: ${JSON.stringify(users)}`);
      expect(users.identifier.username).toBe("ayansasmalAdmin");
    }
  });
});

test("Test to check User creation with No Role", async () => {
  testName = "Test to check User creation with No Role";
  testLogger.debug(testName);
  const response = await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmalNo",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithNoRightRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(403);

  //console.log(response.status, response.body);
});

test("Test to check User creation with invalid password", async () => {
  testName = "Test to check User creation with invalid password";
  testLogger.debug("Test to check User creation with invalid password");
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
    .set("authorization", authWithUserRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to check User creation with invalid email", async () => {
  testName = "Test to check User creation with invalid email";
  testLogger.debug("Test to check User creation with invalid email");
  await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmal1",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal1",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to check User creation with blank details", async () => {
  testName = "Test to check User creation with blank details";
  testLogger.debug("Test to check User creation with blank details");
  await request(appServer)
    .post("/user")
    .send({})
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to check User creation with duplicate username", async () => {
  testName = "Test to check User creation with duplicate username";
  testLogger.debug("Test to check User creation with duplicate username");
  await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmal2",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal1",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmal2",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal2",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test User creation with invalid emailaddress", async () => {
  testName = "Test User creation with invalid emailaddress";
  try {
    await new UserModel({
      identifier: {
        username: "ayansasmal2",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi@gma@il.com",
        mobileNumber: "0452299076",
      },
      role: ["dastkar-app-creator", "dastkar-super-user"],
    }).save();
  } catch (err) {
    testLogger.error("Unable to save", err);
  }
});

test("Test to fetch User details", async () => {
  testName = "Test to fetch User details";
  testLogger.debug("Test to fetch User details");
  const response = await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmal3",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandeli@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal1",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  const responseFetch = await request(appServer)
    .get("/user/ayansasmal3")
    .set("Accept", "application/json")
    .set("authorization", authWithAdminRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);

  expect(responseFetch.body.identifier.username).toBe("ayansasmal3");
});

test("Test to fetch invalid User details", async () => {
  testName = "Test to fetch invalid User details";
  testLogger.debug("Test to fetch User details");
  const response = await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmal3",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandeli@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal1",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  const responseFetch = await request(appServer)
    .get("/user/ayansasmal33")
    .set("Accept", "application/json")
    .set("authorization", authWithAdminRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to fetch all users", async () => {
  testName = "Test to fetch all users";
  testLogger.debug("Test to fetch all users");
  const response = await request(appServer)
    .post("/user")
    .send({
      identifier: {
        username: "ayansasmal3",
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandeli@gmail.com",
        mobileNumber: "0452299076",
      },
      password: "ayansasmal1",
      role: ["dastkar-app-creator", "dastkar-super-user"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithAdminRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  //console.log('service response ',response.body);

  const responseFetch = await request(appServer)
    .get("/user")
    .set("Accept", "application/json")
    .set("authorization", authWithAdminRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);
  // console.log(responseFetch.body);
  expect(responseFetch.body.length).toBe(1);
  // expect(responseFetch.body.identifier.username).toBe('ayansasmal3');
});

test("Test to fetch all users when no users", async () => {
  testName = "Test to fetch all users when no users";
  testLogger.debug("Test to fetch all users when no users");
  const responseFetch = await request(appServer)
    .get("/user")
    .set("Accept", "application/json")
    .set("authorization", authWithAdminRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

// test updating user
