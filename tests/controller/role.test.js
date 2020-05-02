import request from "supertest";
import app from "../../src/app";
import { clearDatabase, closeDatabase } from "../../src/db/handler";
import { getMessageId, initializeLogger } from "../../src/utils/logger";
import { logger } from "../../src/utils/jwt";

const testLogger = initializeLogger("roles-test-js");

let appServer;
let testName;

const authWithAllRole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF5YW5zYXNtYWwiLCJmaXJzdG5hbWUiOiJBeWFuIiwibGFzdG5hbWUiOiJzYXNtYWwiLCJlbWFpbCI6ImF5YW5kZWxoaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOiIwNDUyMjk5MDc2Iiwicm9sZSI6WyJkYXN0a2FyLXJvbGUtY3JlYXRlIiwiZGFzdGthci1yb2xlLXJlYWQiLCJkYXN0a2FyLXJvbGUtZGVsZXRlIiwiZGFzdGthci1hcHAtYWRtaW4iXSwiaWF0IjoxNTg4MjM0MTE4fQ.BCyNa7jMlPMwJvCjX3gPYdJkm6YbYujThXWfo5vCz4U";

beforeAll(async () => {
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

test("create role", async () => {
  testName = "create role";
  testLogger.debug(testName);
  const response = await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-admin", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect(201)
    .expect("Content-Type", "application/json; charset=utf-8");
});

test("create duplicate role", async () => {
  testName = "create duplicate role";
  testLogger.debug(testName);
  const response = await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-admin", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  const responseAgain = await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-admin", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(400);
});

test("fetch All role", async () => {
  testName = "fetch All role";
  testLogger.debug(testName);
  const createResponse = await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-admin", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  const response = await request(appServer)
    .get("/roles")
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  testLogger.debug(response.body);
});

test("fetch All role from empty db", async () => {
  testName = "fetch All role";
  testLogger.debug(testName);
  const response = await request(appServer)
    .get("/roles")
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect(404)
    .expect("Content-Type", "application/json; charset=utf-8");

  testLogger.debug(response.body);
});

test("fetch role", async () => {
  testName = "fetch role";
  testLogger.debug(testName);
  const createResponse = await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-admin", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  const response = await request(appServer)
    .get("/roles/dastkar-app-admin")
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  testLogger.debug(response.body);
});

test("fetch role from empty db", async () => {
  testName = "fetch role from empty db";
  testLogger.debug(testName);
  const response = await request(appServer)
    .get("/roles/dastkar-app-admin")
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect(404)
    .expect("Content-Type", "application/json; charset=utf-8");

  testLogger.debug(response.body);
});

test("delete role", async () => {
  testName = "delete role";
  testLogger.debug(testName);
  const createResponse = await request(appServer)
    .post("/roles")
    .send({ name: "dastkar-app-admin", description: "Role for app admin" })
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(201);

  const response = await request(appServer)
    .delete("/roles/dastkar-app-admin")
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  testLogger.debug(response.body);
});

test("delete invalid role", async () => {
  testName = "delete invalid role";
  testLogger.debug(testName);

  const response = await request(appServer)
    .delete("/roles/dastkar-app-admin")
    .set("Accept", "application/json")
    .set("authorization", authWithAllRole)
    .expect(400)
    .expect("Content-Type", "application/json; charset=utf-8");

  testLogger.debug(response.body);
});
