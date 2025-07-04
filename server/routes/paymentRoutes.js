const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  generateAndSendPaymentQR,
  generatePaymentQR
} = require("../controllers/paymentController");

// Send payment QR code via email
router.post("/:id/send-qr", protect, generateAndSendPaymentQR);

// Generate payment QR code (download only)
router.get("/:id/qr-code", protect, generatePaymentQR);

module.exports = router;