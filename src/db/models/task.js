import mongoose from "mongoose";

const Task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdOn: {
    type: String
  }
});

export default Task;
