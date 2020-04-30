import mongoose from "mongoose";

export const Role = mongoose.model("Role", {
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  createdOn: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
    trim: true,
  },
});

export const AccessRegistry = mongoose.model("AccessRegistry", {
  interface: { type: String, required: true },
  role: { type: String },
});
