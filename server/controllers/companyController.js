const Company = require("../models/Company");

const setCompanyInfo = async (req, res) => {
  try {
    const { 
      name, 
      address, 
      phone, 
      website, 
      email,
      // Payment Information
      paypalHandle,
      venmoHandle,
      cashappHandle,
      zelleEmail,
      bitcoinAddress,
      stripePublishableKey,
      // UPI Payment Methods
      googlePayUPI,
      phonepeUPI
    } = req.body;

    const existing = await Company.findOne({ user: req.user.userId });

    if (existing) {
      existing.name = name;
      existing.address = address;
      existing.phone = phone;
      existing.website = website;
      existing.email = email;
      // Payment Information
      existing.paypalHandle = paypalHandle;
      existing.venmoHandle = venmoHandle;
      existing.cashappHandle = cashappHandle;
      existing.zelleEmail = zelleEmail;
      existing.bitcoinAddress = bitcoinAddress;
      existing.stripePublishableKey = stripePublishableKey;
      // UPI Payment Methods
      existing.googlePayUPI = googlePayUPI;
      existing.phonepeUPI = phonepeUPI;
      
      const updated = await existing.save();
      return res.json({ message: "Company info updated", company: updated });
    }

    const newCompany = new Company({
      user: req.user.userId,
      name,
      address,
      phone,
      website,
      email,
      // Payment Information
      paypalHandle,
      venmoHandle,
      cashappHandle,
      zelleEmail,
      bitcoinAddress,
      stripePublishableKey,
      // UPI Payment Methods
      googlePayUPI,
      phonepeUPI,
    });

    const saved = await newCompany.save();
    res.status(201).json({ message: "Company info saved", company: saved });
  } catch (err) {
    console.error("Company Info Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getCompanyInfo = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.userId });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { setCompanyInfo, getCompanyInfo };
