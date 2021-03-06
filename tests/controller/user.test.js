import request from "supertest";
import app from "../../src/app";
import { clearDatabase, closeDatabase } from "../../src/db/handler";
// models
import UserModel from "../../src/db/models/user";
import { getMessageId, initializeLogger } from "../../src/utils/logger";
import bcrypt from "bcrypt";

const testLogger = initializeLogger("user-test-js");

let appServer;
let testName;

const authWithBothRoles =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLXVzZXItY3JlYXRlIiwiZGFzdGthci1hcHAtYWRtaW4iLCJkYXN0a2FyLXVzZXItdXBkYXRlIl0sImlhdCI6MTU4ODIzNDExOH0.WgamTatK5p8P6ghKL3WyzFBg4AMPs5oZn48VGZwKEXA";

const authWithUserRole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLXVzZXItY3JlYXRlIiwiZGFzdGthci11c2VyLXVwZGF0ZSIsImRhc3RrYXItdXNlci1yZWFkIiwiZGFzdGthci11c2VyLWRlbGV0ZSIsImRhc3RrYXItYXBwLWFkbWluIl0sImlhdCI6MTU4ODIzNDExOH0.EjKKxxmmv4B4btYdyNd2dogqEqxbTbnzFrfLOfbG19Y";
const authWithAdminRole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLWFwcC1hZG1pbiJdLCJpYXQiOjE1ODgyMzQxMTh9.GOUlCR8YHGyCgJbA6hyP5Bl7w7LyUSWssSAduvLyQXw";
const authWithNoRightRole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLWFwcC1jcmVhdG9yIl0sImlhdCI6MTU4ODIzNDExOH0._c7gG3AE10II_G8L2C9qx_52as5k6Zq6m3QsCwM2wb8";

const authWithAllRole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLXJvbGUtY3JlYXRlIiwiZGFzdGthci1yb2xlLXJlYWQiLCJkYXN0a2FyLXJvbGUtZGVsZXRlIiwiZGFzdGthci1hcHAtYWRtaW4iXSwiaWF0IjoxNTg4MjM0MTE4fQ.BCyNa7jMlPMwJvCjX3gPYdJkm6YbYujThXWfo5vCz4U";

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
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
      role: ["dastkar-app-creator"],
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

test("Test to check User creation with invalid roles", async () => {
  testName = "Test to check User creation with invalid roles";
  testLogger.debug("Test to check User creation with invalid roles");
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
      role: ["dastkar-app-creator","dastkar-user-read"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithBothRoles)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to check User creation with no roles", async () => {
  testName = "Test to check User creation with no roles";
  testLogger.debug("Test to check User creation with no roles");
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
      password: "ayansasmal"
    })
    .set("Accept", "application/json")
    .set("authorization", authWithBothRoles)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});


test("Test to check User creation with User Role", async () => {
  testName = "Test to check User creation with User Role";
  testLogger.debug(testName);
  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
      role: ["dastkar-app-creator"],
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
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
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

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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
test("Test to update the user details", async () => {
  testName = "Test to update the user details";
  testLogger.debug(testName);
  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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

  const updateResp = await request(appServer)
    .post("/user/ayansasmalBoth")
    .send({
      identifier: {
        firstName: "Ayan",
        lastName: "sasmal",
        email: "ayandelhi1@gmail.com",
        mobileNumber: "61452299076",
      },
      password: "ayansasmalNew",
      oldPassword: "ayansasmal",
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect(201);
  console.log("Update response", updateResp.body);

  const fetchResponse = await request(appServer)
    .get("/user/ayansasmalBoth")
    .set("Accept", "application/json")
    .set("authorization", authWithAdminRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);

  console.log("Fetch response", fetchResponse.body);
  expect(fetchResponse.body.identifier.email).toBe("ayandelhi1@gmail.com");
  expect(fetchResponse.body.identifier.mobileNumber).toBe("61452299076");

  await request(appServer)
    .post("/login")
    .send({ username: "ayansasmalBoth", password: "ayansasmalNew" })
    .set("Accept", "application/json")
    .expect(204);

  testLogger.debug("Test cases are good till here");
  testLogger.debug("before update request with names");
  await request(appServer)
    .post("/user/ayansasmalBoth")
    .send({
      identifier: {
        firstName: "Ayan",
        lastName: "sasmal",
      },
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect(201);

  testLogger.debug("Test cases are good till here");
  testLogger.debug("before update request with roles");
  await request(appServer)
    .post("/user/ayansasmalBoth")
    .send({
      identifier: {},
      role: ["dastkar-app-one"],
    })
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    .expect(400);
});

test("Test to delete User", async () => {
  testName = "Test to delete User";
  testLogger.debug(testName);
  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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

  const deleteResponse = await request(appServer)
    .delete("/user/ayansasmalBoth")
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    // .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);

  testLogger.debug(`Delete response ${JSON.stringify(deleteResponse.body)}`);

  await request(appServer)
    .get("/user/ayansasmalBoth")
    .set("Accept", "application/json")
    .set("authorization", authWithAdminRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);

  await request(appServer)
    .post("/login")
    .send({ username: "ayansasmalBoth", password: "ayansasmal" })
    .set("Accept", "application/json")
    .expect(403);
});

test("Test to delete Logged in User", async () => {
  testName = "Test to delete Logged in User";
  testLogger.debug(testName);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-creator", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-super-user", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

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

  await request(appServer)
    .post("/login")
    .send({ username: "ayansasmalBoth", password: "ayansasmal" })
    .set("Accept", "application/json")
    .expect(204);

  const deleteResponse = await request(appServer)
    .delete("/user/ayansasmalBoth")
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    // .expect("Content-Type", "application/json; charset=utf-8")
    .expect(404);

  testLogger.debug(`Delete response ${JSON.stringify(deleteResponse.body)}`);
});

test("Test to delete invalid User", async () => {
  testName = "Test to invalid User";
  testLogger.debug(testName);

  const deleteResponse = await request(appServer)
    .delete("/user/ayansasmalBoth")
    .set("Accept", "application/json")
    .set("authorization", authWithUserRole)
    // .expect("Content-Type", "application/json; charset=utf-8")
    .expect(404);

  testLogger.debug(`Delete response ${JSON.stringify(deleteResponse.body)}`);
});
