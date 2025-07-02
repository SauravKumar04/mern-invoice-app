const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOtp,
  loginUser,
  resetPassword,
  resendOtp,
  updateProfile,
  logoutUser,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { forgotPassword } = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register new user and send OTP
router.post("/register", registerUser);

// @route POST /api/auth/verify
// @desc Verify User's Email
router.post("/verify", verifyOtp);

// @route POST /api/auth/login
// @desc  User Login
router.post("/login", loginUser);

// Protected route example
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Welcome to your profile!",
    user: req.user, // contains userId and possibly email if you included it in the token
  });
});

//Forgot Password
router.post("/forgot-password", forgotPassword);

// @route POST /api/auth/reset-password
// @desc  Reset Password using OTP
router.post("/reset-password", resetPassword);

// Resend OTP
router.post("/resend-otp", resendOtp);

//Update Profile
router.put("/update-profile", protect, upload.single('avatar'), updateProfile);

//Logout
router.post("/logout", logoutUser);

module.exports = router;
