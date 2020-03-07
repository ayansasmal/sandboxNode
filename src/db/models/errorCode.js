import mongoose from "mongoose";

const ErrorCode = mongoose.model("ErrorCode", {
  code: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  description: { type: String, trim: true }
});

export default ErrorCode;
