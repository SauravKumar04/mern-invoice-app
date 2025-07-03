const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  generateInvoicePdfHTML,
  updateInvoiceStatus,
  getDashboardStats,
  getInvoiceTemplates,
} = require("../controllers/invoiceController");
const { sendInvoiceEmail } = require("../controllers/invoiceController");

// Test email configuration endpoint
router.post("/test-email", protect, async (req, res) => {
  try {
    console.log("🧪 Testing email configuration...");
    
    // Check if email configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        error: "EMAIL_CONFIG_MISSING",
        message: "Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables."
      });
    }

    const testEmail = req.body.email || req.user.email || process.env.EMAIL_USER;
    
    console.log(`📧 Testing email to: ${testEmail}`);
    console.log(`📧 Using EMAIL_USER: ${process.env.EMAIL_USER}`);
    console.log(`📧 EMAIL_PASS configured: ${!!process.env.EMAIL_PASS}`);
    
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { 
        rejectUnauthorized: false 
      },
      debug: true,
      logger: true
    });

    console.log("🔍 Verifying transporter configuration...");
    await transporter.verify();
    console.log("✅ Transporter verification successful!");
    
    console.log("📧 Sending test email...");
    await transporter.sendMail({
      from: `"InvoX Test" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: "✅ InvoX Email Test Successful - Configuration Working!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
            <h1 style="color: #4c1d95; margin-bottom: 20px;">🎉 Email Test Successful!</h1>
            <p style="color: #6b7280; font-size: 16px; margin-bottom: 20px;">
              Congratulations! Your InvoX email configuration is working correctly.
            </p>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e; margin: 20px 0;">
              <strong style="color: #166534;">✅ Email Configuration Status: WORKING</strong>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              You can now send invoice emails successfully. This test was sent at ${new Date().toLocaleString()}.
            </p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #8b5cf6; font-weight: bold;">Powered by InvoX</p>
            </div>
          </div>
        </div>
      `,
      text: `InvoX Email Test Successful! Your email configuration is working correctly. Test sent at ${new Date().toLocaleString()}.`
    });

    console.log("✅ Test email sent successfully!");

    res.json({ 
      success: true, 
      message: "Test email sent successfully! Check your inbox.",
      recipient: testEmail,
      timestamp: new Date().toISOString(),
      configuration: {
        service: "Gmail",
        user: process.env.EMAIL_USER,
        host: "smtp.gmail.com",
        port: 587
      }
    });
  } catch (error) {
    console.error("❌ Email test failed:", error);
    
    let errorMessage = "Email test failed";
    let errorCode = "EMAIL_TEST_FAILED";
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      errorMessage = "Email authentication failed. Please check your Gmail App Password.";
      errorCode = "EMAIL_AUTH_FAILED";
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = "Network error. Unable to connect to Gmail servers.";
      errorCode = "EMAIL_NETWORK_ERROR";
    } else if (error.responseCode === 550) {
      errorMessage = "Invalid recipient email address.";
      errorCode = "EMAIL_INVALID_RECIPIENT";
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorCode,
      message: errorMessage,
      details: error.message,
      troubleshooting: {
        gmail_setup: "Ensure you're using a Gmail App Password, not your regular password",
        two_factor: "Enable 2-Factor Authentication on your Google account",
        app_password: "Generate an App Password in Google Account settings → Security → App passwords",
        env_check: "Verify EMAIL_USER and EMAIL_PASS are set in your .env file",
        restart: "Restart your server after updating .env file"
      }
    });
  }
});

// Create a new invoice
router.post("/", protect, createInvoice);

// Get all invoices for the logged-in user
router.get("/", protect, getInvoices);

// Dashboard statistics (MUST come before `/:id`)
router.get("/dashboard/stats", protect, getDashboardStats);

// Get available invoice templates (MUST come before `/:id`)
router.get("/templates", protect, getInvoiceTemplates);

// Generate PDF for a specific invoice (MUST come before `/:id`)
router.get("/:id/pdf-html", protect, generateInvoicePdfHTML);

// Generate PDF for a specific invoice with template (MUST come before `/:id`)
router.get("/:id/pdf-html/:template", protect, generateInvoicePdfHTML);

// Update only the status of a specific invoice (MUST come before `/:id`)
router.patch("/:id/status", protect, updateInvoiceStatus);

// Get a single invoice by ID
router.get("/:id", protect, getInvoiceById);

// Update a specific invoice by ID
router.put("/:id", protect, updateInvoice);

// Delete a specific invoice by ID
router.delete("/:id", protect, deleteInvoice);

// Send invoice via email
router.post("/:id/email", protect, sendInvoiceEmail);

module.exports = router;
