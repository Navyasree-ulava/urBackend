const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/stats", authMiddleware, analyticsController.getGlobalStats);
router.get("/activity", authMiddleware, analyticsController.getRecentActivity);

module.exports = router;
