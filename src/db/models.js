import mongoose from "mongoose";

const Models = {};
Models.Task = mongoose.model("Task", {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  },
  createdOn: {
    type: String
  }
});

export default Models;
