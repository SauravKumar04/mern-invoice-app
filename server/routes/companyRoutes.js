const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { setCompanyInfo, getCompanyInfo } = require("../controllers/companyController");

// 🛠️ Fix: Add upload.single("logo")
router.post("/", protect, upload.single("logo"), setCompanyInfo);
router.get("/", protect, getCompanyInfo);

module.exports = router;
