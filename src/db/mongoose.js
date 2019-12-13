import mongoose from "mongoose";
import { initializeLogger } from "../utils/logger";

const connectionURI =
  "mongodb+srv://super-user:super-user-mongo-ayan@maincluster-cmwtk.mongodb.net/test?retryWrites=true&w=majority";
const logger = initializeLogger("mongoose-js");

mongoose.Promise = global.Promise;

mongoose.connect(connectionURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const User = mongoose.model("User", {
  name: {
    type: String
  },
  age: {
    type: Number
  }
});

const me = new User({
  name: "Ayan Sasmal",
  age: 31
});

// me.save().then(doc => {
//     logger.debug(doc);
// }).catch(error => {
//     logger.error(error);
// });

const Task = mongoose.model("Task", {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

const newTask = new Task({
  description: "Create a new Task",
  completed: false
});

newTask
  .save()
  .then(doc => {
    logger.debug(`Saved Document:: ${JSON.stringify(doc)}`);
  })
  .catch(err => {
    logger.error(`Unable to save document ${JSON.stringify(err)}`);
  });
