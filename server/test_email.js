const nodemailer = require("nodemailer");
require("dotenv").config();

async function testEmail() {
  console.log("🔍 Testing email configuration...");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Not set");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Not set");
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("❌ Missing email credentials in environment variables");
    return;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📧 Testing SMTP connection...");
    
    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection successful!");

    // Send a test email
    console.log("📤 Sending test email...");
    const info = await transporter.sendMail({
      from: `"Invoice App Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: "Email Test - Invoice App",
      text: "This is a test email to verify email functionality is working.",
      html: "<p>This is a test email to verify email functionality is working.</p>",
    });

    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    
  } catch (error) {
    console.error("❌ Email test failed:");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    
    if (error.code) {
      console.error("Error code:", error.code);
    }
    
    if (error.response) {
      console.error("SMTP response:", error.response);
    }
    
    // Common Gmail SMTP issues
    if (error.message.includes("Invalid login")) {
      console.log("\n💡 Possible solutions:");
      console.log("1. Check if you're using an App Password instead of your regular Gmail password");
      console.log("2. Enable 2-factor authentication and generate an App Password");
      console.log("3. Verify the email address is correct");
    }
    
    if (error.message.includes("Less secure app")) {
      console.log("\n💡 Solution: Use App Password instead of regular password");
      console.log("   Go to: Google Account > Security > App passwords");
    }
  }
}

testEmail();