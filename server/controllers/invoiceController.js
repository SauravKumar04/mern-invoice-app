const puppeteer = require("puppeteer");
const Invoice = require("../models/Invoice");
const mongoose = require("mongoose");
const Company = require("../models/Company");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");

// Create Invoice
const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      items = [],
      tax = 0,
      discount = 0,
      issueDate,
      dueDate,
      status,
      notes,
    } = req.body;

    // Parse and sanitize items
    const parsedItems = items.map((item) => ({
      name: item.name,
      description: item.description || "", // Ensure required field is present
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    // Calculate subtotal and total
    const subTotal = parsedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const total = subTotal + Number(tax) - Number(discount);

    const invoice = new Invoice({
      user: req.user.userId,
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      items: parsedItems,
      tax: Number(tax),
      discount: Number(discount),
      total,
      issueDate,
      dueDate,
      status,
      notes,
    });

    const saved = await invoice.save();
    res.status(201).json({ message: "Invoice created", invoice: saved });
  } catch (error) {
    console.error("Create Invoice Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all invoices for logged-in user
const getInvoices = async (req, res) => {
  try {
    const filter = { user: req.user.userId };

    if (req.query.status) {
      filter.status = req.query.status;
    }
    // Filter by due date
    if (req.query.due === "overdue") {
      filter.dueDate = { $lt: new Date() };
    } else if (req.query.due === "upcoming") {
      const today = new Date();
      const inSevenDays = new Date();
      inSevenDays.setDate(today.getDate() + 7);

      filter.dueDate = {
        $gte: today,
        $lte: inSevenDays,
      };
    }

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error("Fetch Invoices Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single invoice
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const company = await Company.findOne({ user: req.user.userId });

    res.json({ invoice, company });
  } catch (error) {
    console.error("Fetch Single Invoice Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Invoice
const updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Invoice not found" });

    res.json({ message: "Invoice updated", invoice: updated });
  } catch (error) {
    console.error("Update Invoice Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Invoice
const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deleted) return res.status(404).json({ message: "Invoice not found" });

    res.json({ message: "Invoice deleted" });
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Generate Invoice PDF
const generateInvoicePdfHTML = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const company = await Company.findOne({ user: req.user.userId });
    if (!company) {
      return res.status(404).json({ message: "Company info not found" });
    }

    // Load the EJS template
    const templatePath = path.join(
      __dirname,
      "../templates/invoiceTemplate.ejs"
    );
    const logoUrl = company.logo
      ? `${process.env.BASE_URL}${company.logo}`
      : null;
    const html = await ejs.renderFile(templatePath, {
      invoice,
      company: { ...company.toObject(), logoUrl },
    });

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
    );
    console.log("Company used in PDF:", company);
    console.log("Invoice used in PDF:", invoice);

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Puppeteer PDF Error:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Draft", "Sent", "Paid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status },
      { new: true }
    );

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json({ message: "Status updated", invoice });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Dashboard
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch invoice stats
    const totalInvoices = await Invoice.countDocuments({ user: userId });

    const statusCounts = await Invoice.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const paidInvoices = await Invoice.find({ user: userId, status: "Paid" });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const invoicesThisMonth = await Invoice.countDocuments({
      user: userId,
      createdAt: { $gte: startOfMonth },
    });

    res.json({
      totalInvoices,
      totalRevenue,
      invoicesThisMonth,
      statusBreakdown: statusCounts,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send Invoice Email
const sendInvoiceEmail = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const company = await Company.findOne({ user: req.user.userId });

    const templatePath = path.join(
      __dirname,
      "../templates/invoiceTemplate.ejs"
    );
    const logoUrl = company.logo
      ? `${process.env.BASE_URL}${company.logo}`
      : null;
    const html = await ejs.renderFile(templatePath, {
      invoice,
      company: { ...company.toObject(), logoUrl },
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${company?.name || "Invoice App"}" <${process.env.EMAIL_USER}>`,
      to: invoice.clientEmail,
      subject: `Invoice #${invoice.invoiceNumber}`,
      text: `Hi ${invoice.clientName},\n\nPlease find your invoice attached.`,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Invoice sent via email" });
  } catch (error) {
    console.error("Send Email Error:", error);
    res.status(500).json({ message: "Failed to send invoice email" });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  generateInvoicePdfHTML,
  updateInvoiceStatus,
  getDashboardStats,
  sendInvoiceEmail,
};
