const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    website: { type: String },
    logo: { type: String }, // URL to uploaded image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
