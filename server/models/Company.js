const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    website: { type: String },
    email: { type: String },
    // Payment Information
    paypalHandle: { type: String },
    venmoHandle: { type: String },
    cashappHandle: { type: String },
    zelleEmail: { type: String },
    bitcoinAddress: { type: String },
    stripePublishableKey: { type: String },
    // Logo and branding
    logo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
