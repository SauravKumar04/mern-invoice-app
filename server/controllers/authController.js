const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Create new user (isVerified = false for now)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    await newUser.save();

    // 5. Send OTP via email
    const message = `Your OTP for Invoice App registration is: ${otp}`;
    await sendEmail(email, "Verify your email", message);

    return res
      .status(201)
      .json({ message: "User registered. OTP sent to email." });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Email Verify OTP

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// User Login:
// Check if user exists
// Verify password
// Check if isVerified === true
// Generate JWT token
// Return user info + token

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiry (e.g., 15 mins)
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send Email
    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP to reset password is: ${otp}`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Check OTP and expiry
    if (
      user.resetPasswordOtp !== otp ||
      user.resetPasswordOtpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  const { email, type } = req.body; // type = "verify" or "reset"

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (type === "verify") {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
      }
      user.otp = otp;
      await sendEmail(email, "Verify your email", `Your OTP is: ${otp}`);
    } else if (type === "reset") {
      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000;
      await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);
    } else {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    await user.save();

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name/email
    if (name) user.name = name;
    if (email) user.email = email;
    if (req.body.profileImage) user.profileImage = req.body.profileImage; 

    // Change password if requested
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload profile picture
// ✅ updated controller
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const relativePath = req.file.path.split("uploads/")[1];
    user.profileImage = relativePath;

    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      imageUrl: `uploads/${relativePath}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: `uploads/${relativePath}`,
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout (stateless version)
const logoutUser = async (req, res) => {
  // The client should just delete the token, but we send a response
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  resendOtp,
  updateProfile,
  uploadProfilePicture,
  logoutUser,
};
