import app from "../../src/app";
import request from "supertest";
import { initializeLogger } from "../../src/utils/logger";

const testLogger = initializeLogger("health-test-js");

let appServer;

beforeAll(async () => {
  // console.log('in User test');
  appServer = await app;
}); 

test('Test to invoke healthcheck', async ()=>{
    testLogger.debug("Test to invoke healthcheck");
    await request(appServer).get('/healthcheck').expect(200);
})