const express = require("express");
const { processHealthReport } = require("../controllers/healthController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/process-health-report", authMiddleware, processHealthReport);
// router.post("/uploadCSV",authMiddleware,uploadCSVData);

module.exports = router;