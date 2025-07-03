const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html = null) => {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration missing: EMAIL_USER or EMAIL_PASS not set");
    }

    // Enhanced transporter configuration for better Gmail compatibility
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,   // Gmail address
        pass: process.env.EMAIL_PASS,   // Gmail App Password
      },
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates
      },
      debug: process.env.NODE_ENV === 'development', // Enable debug output
      logger: process.env.NODE_ENV === 'development' // Log information in console
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ Email transporter configuration verified");

    const mailOptions = {
      from: `"InvoX" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    // Add HTML content if provided
    if (html) {
      mailOptions.html = html;
    }

    console.log(`📧 Sending email to ${to}...`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
    
    return result;
  } catch (error) {
    console.error("❌ Email send error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Email send failed";
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      errorMessage = "Email authentication failed. Please check your Gmail App Password.";
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = "Network error. Unable to connect to Gmail servers.";
    } else if (error.responseCode === 550) {
      errorMessage = "Invalid recipient email address.";
    } else if (error.message.includes("configuration missing")) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

module.exports = sendEmail;
