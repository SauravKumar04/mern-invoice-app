const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // My Gmail address
        pass: process.env.EMAIL_PASS,   // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"InvoX" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw new Error("Email send failed");
  }
};

module.exports = sendEmail;
