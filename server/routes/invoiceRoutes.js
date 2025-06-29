const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  generateInvoicePdfHTML,
  updateInvoiceStatus,
  getDashboardStats,
} = require("../controllers/invoiceController");
const { sendInvoiceEmail } = require("../controllers/invoiceController");

// Create a new invoice
router.post("/", protect, createInvoice);

// Get all invoices for the logged-in user
router.get("/", protect, getInvoices);

// Dashboard statistics (MUST come before `/:id`)
router.get("/dashboard/stats", protect, getDashboardStats);

// Generate PDF for a specific invoice (MUST come before `/:id`)
router.get("/:id/pdf-html", protect, generateInvoicePdfHTML);

// Update only the status of a specific invoice (MUST come before `/:id`)
router.patch("/:id/status", protect, updateInvoiceStatus);

// Get a single invoice by ID
router.get("/:id", protect, getInvoiceById);

// Update a specific invoice by ID
router.put("/:id", protect, updateInvoice);

// Delete a specific invoice by ID
router.delete("/:id", protect, deleteInvoice);


router.post("/:id/email", protect, sendInvoiceEmail);


module.exports = router;
