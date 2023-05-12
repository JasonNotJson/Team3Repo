import { Router } from "express";
import Schema from "../models/schema.js";

export const router = Router();

router.get("/", async (req, res) => {
  try {
    const chatLog = await Schema.find();
    res.send(chatLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.send("Hello World!");
});

router.get("/:id", (req, res) => {
  res.send(req.params.id);
});

router.post("/:id", async (req, res) => {
  const chatLog = new Schema({
    role: req.body.role,
    message: req.body.message,
  });
  try {
    const newChatLog = await chatLog.save();
    res.status(201).json(newChatLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});
