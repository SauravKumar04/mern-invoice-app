const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { setCompanyInfo, getCompanyInfo } = require("../controllers/companyController");

// Get company info by invoice ID (public endpoint for payment hub)
router.get("/:invoiceId/public", async (req, res) => {
  try {
    const Invoice = require("../models/Invoice");
    const Company = require("../models/Company");
    
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    const company = await Company.findOne({ user: invoice.user }).select('name email paypalHandle venmoHandle cashappHandle zelleEmail googlePayUPI phonepeUPI');
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", protect, setCompanyInfo);
router.get("/", protect, getCompanyInfo);

module.exports = router;
