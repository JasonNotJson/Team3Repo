import mongoose from "mongoose";

export const chatSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const Schema = mongoose.model("Chat", chatSchema);

export default Schema;
