const express = require("express");
const { askLLM, askGlobalLLM } = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/ask", askLLM);

module.exports = router;