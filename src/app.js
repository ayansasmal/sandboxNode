import express from "express";
import { connectDatabase, closeDatabase, clearDatabase } from "./db/handler";
import { createServer } from "http";
import { initializeLogger } from "./utils/logger";
import taskRouter from "./routes/task";
import userRouter from "./routes/user";
import roleRouter from "./routes/role";

const logger = initializeLogger("app-js");

logger.info("Server is up and running");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;
//create a server object:
createServer(app).listen(port); //the server object listens on port 8080
connectDatabase();

app.get("/", function(req, res) {
  logger.debug("got root");
  res.write(`${new Date()} Server is up and ready to use`);
  res.end(); //end the response
});

app.use("/task", taskRouter);

app.use("/user", userRouter);

app.use("/role", roleRouter);
