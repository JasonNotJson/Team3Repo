import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Schema = mongoose.model("Chat", chatSchema);

export default Schema;
