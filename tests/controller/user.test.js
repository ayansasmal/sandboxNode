import app from "../../src/app";
// import bcrypt from "bcrypt";
import request from "supertest";
import { initializeLogger } from "../../src/utils/logger";
import { closeDatabase, clearDatabase } from "../../src/db/handler";

// models
import UserModel from "../../src/db/models/user";
import UserOperation from "../../src/db/operations/user";

const testLogger = initializeLogger("user-test-js");

let appServer;

beforeAll(async () => {
  // console.log('in User test');
  appServer = await app;
  await clearDatabase();
});

afterEach(async () => {
  await clearDatabase();
})

afterAll(async () => {
  await closeDatabase();
});

/*

*/

test("Test to check User creation", async () => {
  testLogger.debug("Test to check User creation...");
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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
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
      expect(users.identifier.username).toBe("ayansasmal");
    }
  });
});


test("Test to check User creation with invalid password", async () => {
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
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to check User creation with invalid email", async () => {
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
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to check User creation with blank details", async () => {
  testLogger.debug("Test to check User creation with blank details");
  await request(appServer)
    .post("/user")
    .send({})
    .set("Accept", "application/json")
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to check User creation with duplicate username", async () => {
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
  .set(
    "authorization",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
  )
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
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test User creation with invalid emailaddress", async () => {
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
  } catch (err){
    testLogger.error('Unable to save', err);
  }
});

test("Test to fetch User details", async () => {
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
  .set(
    "authorization",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
  )
  .expect("Content-Type", "application/json; charset=utf-8")
  .expect(201);

  const responseFetch = await request(appServer)
    .get("/user/ayansasmal3")
    .set("Accept", "application/json")
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);
    
    expect(responseFetch.body.identifier.username).toBe('ayansasmal3');
});


test("Test to fetch invalid User details", async () => {
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
  .set(
    "authorization",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
  )
  .expect("Content-Type", "application/json; charset=utf-8")
  .expect(201);

  const responseFetch = await request(appServer)
    .get("/user/ayansasmal33")
    .set("Accept", "application/json")
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("Test to fetch all users", async () => {
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
  .set(
    "authorization",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
  )
  .expect("Content-Type", "application/json; charset=utf-8")
  .expect(201);

  //console.log('service response ',response.body);

  const responseFetch = await request(appServer)
    .get("/user")
    .set("Accept", "application/json")
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);
    // console.log(responseFetch.body);
    expect(responseFetch.body.length).toBe(1);
    // expect(responseFetch.body.identifier.username).toBe('ayansasmal3');
});

test("Test to fetch all users when no users", async () => {
  testLogger.debug("Test to fetch all users when no users");
  const responseFetch = await request(appServer)
    .get("/user")
    .set("Accept", "application/json")
    .set(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwxIiwiZmlyc3RuYW1lIjoiQXlhbiIsImxhc3RuYW1lIjoic2FzbWFsIiwibGFzdExvZ2dlZEluIjoiU3VuZGF5LCAyOSBNYXJjaCAyMDIwLCAwMDowODoyNCIsInJvbGVzIjpbImRhc3RrYXItYXBwLWNyZWF0b3IiLCJkYXN0a2FyLXN1cGVyLXVzZXIiXSwiaWF0IjoxNTg1NDAwOTY1fQ.PTspgnGJF0MSjL8USCFjd5rrSknr4WR41VO3YvZpXPM"
    )
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});