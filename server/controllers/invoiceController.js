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

    const parsedItems = items.map((item) => ({
      name: item.name,
      description: item.description || "",
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

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

const getInvoices = async (req, res) => {
  try {
    const filter = { user: req.user.userId };

    if (req.query.status) {
      filter.status = req.query.status;
    }

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

    const templatePath = path.join(
      __dirname,
      "../templates/invoiceTemplate.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      invoice,
      company: company ? company.toObject() : {},
    });

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

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

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

    let pdfBuffer;
    try {
      const templatePath = path.join(
        __dirname,
        "../templates/invoiceTemplate.ejs"
      );

      const html = await ejs.renderFile(templatePath, {
        invoice,
        company: company ? company.toObject() : {},
      });

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox", 
          "--disable-setuid-sandbox", 
          "--disable-dev-shm-usage",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor"
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      await browser.close();
      
    } catch (pdfError) {
      console.error("PDF Generation Error:", pdfError);
      console.error("Error details:", {
        message: pdfError.message,
        stack: pdfError.stack,
        puppeteerExecutable: require('puppeteer').executablePath()
      });
      
      // Fallback: Send email without PDF attachment
      console.log("📧 Fallback: Sending email without PDF attachment...");
      try {
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
          html: `
            <h2>Invoice #${invoice.invoiceNumber}</h2>
            <p>Hi ${invoice.clientName},</p>
            <p>Your invoice details:</p>
            <ul>
              <li><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</li>
              <li><strong>Total Amount:</strong> $${invoice.total.toFixed(2)}</li>
              <li><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</li>
            </ul>
            <p>Please contact us for the PDF version of this invoice.</p>
            <p>Thank you for your business!</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        return res.json({ 
          message: "Invoice notification sent via email (PDF generation temporarily unavailable)" 
        });
        
      } catch (emailError) {
        console.error("Fallback email also failed:", emailError);
        return res.status(500).json({ 
          message: "Failed to send invoice email",
          error: process.env.NODE_ENV === 'development' ? emailError.message : 'Email sending error'
        });
      }
    }

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
