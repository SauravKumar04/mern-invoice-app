const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const QRCode = require('qrcode');

// Test email functionality in production
router.get("/email-test", async (req, res) => {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Check environment variables
    const envCheck = {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      FRONTEND_URL: !!process.env.FRONTEND_URL,
      NODE_ENV: process.env.NODE_ENV
    };
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        error: "Email configuration missing",
        envCheck,
        fix: "Set EMAIL_USER and EMAIL_PASS in Render dashboard"
      });
    }
    
    // Create transporter (same config as QR email)
    const transporter = nodemailer.createTransport({
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
      }
    });
    
    // Test SMTP connection
    await transporter.verify();
    
    // Send test email
    const testEmail = {
      from: `"QR Email Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `🧪 Production Email Test - ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <h2>✅ Email System Working!</h2>
          <p>This confirms your email configuration is working in production.</p>
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 20px 0;">
            <strong>Environment:</strong> ${process.env.NODE_ENV || 'production'}<br>
            <strong>Frontend URL:</strong> ${process.env.FRONTEND_URL}<br>
            <strong>Test Time:</strong> ${new Date().toLocaleString()}<br>
          </div>
          <p>🎉 Your QR code emails should work now!</p>
        </div>
      `
    };
    
    await transporter.sendMail(testEmail);
    
    res.json({
      success: true,
      message: "Test email sent successfully!",
      envCheck,
      testEmail: process.env.EMAIL_USER,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    let errorType = "Unknown";
    let fix = "Check server logs for details";
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      errorType = "Gmail Authentication Failed";
      fix = "Check EMAIL_PASS is Gmail App Password, not regular password";
    } else if (error.code === 'ENOTFOUND') {
      errorType = "Network/DNS Issue";
      fix = "Check internet connection and SMTP settings";
    } else if (error.message.includes('timeout')) {
      errorType = "Connection Timeout";
      fix = "Production server may have firewall restrictions";
    }
    
    res.status(500).json({
      success: false,
      error: errorType,
      message: error.message,
      fix,
      envCheck: {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        FRONTEND_URL: !!process.env.FRONTEND_URL
      }
    });
  }
});

// Test QR code generation
router.get("/qr-test", async (req, res) => {
  try {
    console.log('🧪 Testing QR code generation...');
    
    const testUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-hub/test123?amount=100&invoice=TEST-001`;
    
    const qrCodeBuffer = await QRCode.toBuffer(testUrl, {
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#4C1D95',
        light: '#FFFFFF'
      },
      width: 300
    });
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="test-qr.png"');
    res.send(qrCodeBuffer);
    
  } catch (error) {
    console.error('❌ QR test failed:', error);
    res.status(500).json({
      success: false,
      error: "QR generation failed",
      message: error.message
    });
  }
});

// Combined test endpoint
router.get("/full-test", async (req, res) => {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      tests: {}
    };
    
    // Environment check
    results.tests.environment = {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      FRONTEND_URL: !!process.env.FRONTEND_URL,
      MONGO_URI: !!process.env.MONGO_URI,
      passed: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.FRONTEND_URL)
    };
    
    // QR generation test
    try {
      const testUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-hub/test123`;
      const qrBuffer = await QRCode.toBuffer(testUrl);
      results.tests.qrGeneration = {
        passed: true,
        url: testUrl,
        size: qrBuffer.length
      };
    } catch (error) {
      results.tests.qrGeneration = {
        passed: false,
        error: error.message
      };
    }
    
    // Email test
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: { rejectUnauthorized: false }
        });
        
        await transporter.verify();
        results.tests.emailConnection = {
          passed: true,
          message: "SMTP connection successful"
        };
      } catch (error) {
        results.tests.emailConnection = {
          passed: false,
          error: error.message,
          fix: error.code === 'EAUTH' ? "Check Gmail App Password" : "Check network/SMTP settings"
        };
      }
    } else {
      results.tests.emailConnection = {
        passed: false,
        error: "Email credentials missing"
      };
    }
    
    const allPassed = Object.values(results.tests).every(test => test.passed);
    
    res.json({
      success: allPassed,
      message: allPassed ? "All tests passed! QR email system should work." : "Some tests failed. Check details below.",
      results,
      recommendations: allPassed ? [
        "✅ System ready for QR code emails",
        "✅ Test with real invoice to confirm"
      ] : [
        "❌ Fix failed tests above",
        "❌ Check environment variables in Render",
        "❌ Verify Gmail App Password is correct"
      ]
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Test failed",
      message: error.message
    });
  }
});

module.exports = router;