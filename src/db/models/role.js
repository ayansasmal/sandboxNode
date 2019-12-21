import mongoose from "mongoose";

const Role = mongoose.model("Role", {
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  createdOn: {
    type: String
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  }
});

export default Role;
