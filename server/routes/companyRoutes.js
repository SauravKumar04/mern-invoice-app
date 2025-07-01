const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { setCompanyInfo, getCompanyInfo } = require("../controllers/companyController");

router.post("/", protect, setCompanyInfo);
router.get("/", protect, getCompanyInfo);

module.exports = router;
