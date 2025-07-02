const puppeteer = require("puppeteer");
const Invoice = require("../models/Invoice");
const mongoose = require("mongoose");
const Company = require("../models/Company");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

// Create beautiful PDF using PDFKit as Puppeteer alternative
const generatePDFWithPDFKit = async (invoice, company) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 0, bottom: 50, left: 0, right: 0 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header with gradient effect (simulated with rectangles)
      doc.rect(0, 0, 595, 120).fill('#667eea');
      doc.rect(0, 0, 595, 120).fill('#764ba2', 0.7);

      // InvoX Logo and Branding
      doc.fontSize(32).fillColor('white').font('Helvetica-Bold');
      doc.text('InvoX', 50, 40);
      doc.fontSize(14).fillColor('white');
      doc.text('Next-gen invoicing.', 50, 75);

      // Invoice Title
      doc.fontSize(36).fillColor('white').font('Helvetica-Bold');
      doc.text('INVOICE', 400, 35);
      doc.fontSize(16);
      doc.text(`#${invoice.invoiceNumber}`, 400, 75);

      // White background for content
      doc.rect(0, 120, 595, 722).fill('white');

      // Company and Client Info Cards
      let yPos = 150;
      
      // From Section
      doc.roundedRect(50, yPos, 220, 120, 10).stroke('#e2e8f0').fillAndStroke('#f8fafc', '#8b5cf6');
      doc.rect(50, yPos, 4, 120).fill('#8b5cf6');
      
      doc.fontSize(12).fillColor('#4c1d95').font('Helvetica-Bold');
      doc.text('FROM', 60, yPos + 15);
      
      doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold');
      doc.text(company?.name || 'Your Company', 60, yPos + 35);
      
      doc.fontSize(11).fillColor('#6b7280').font('Helvetica');
      if (company?.address) doc.text(company.address, 60, yPos + 55);
      if (company?.email) doc.text(`Email: ${company.email}`, 60, yPos + 70);
      if (company?.phone) doc.text(`Phone: ${company.phone}`, 60, yPos + 85);

      // Bill To Section
      doc.roundedRect(325, yPos, 220, 120, 10).stroke('#e2e8f0').fillAndStroke('#f8fafc', '#8b5cf6');
      doc.rect(325, yPos, 4, 120).fill('#8b5cf6');
      
      doc.fontSize(12).fillColor('#4c1d95').font('Helvetica-Bold');
      doc.text('BILL TO', 335, yPos + 15);
      
      doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold');
      doc.text(invoice.clientName, 335, yPos + 35);
      
      doc.fontSize(11).fillColor('#6b7280').font('Helvetica');
      doc.text(invoice.clientEmail, 335, yPos + 55);
      if (invoice.clientAddress) doc.text(invoice.clientAddress, 335, yPos + 70);

      // Invoice Details Cards
      yPos = 300;
      const cardWidth = 120;
      const cardSpacing = 130;

      // Issue Date Card
      doc.roundedRect(50, yPos, cardWidth, 60, 8).stroke('#e2e8f0').fill('#f8fafc');
      doc.fontSize(10).fillColor('#6b7280').font('Helvetica-Bold');
      doc.text('ISSUE DATE', 60, yPos + 10);
      doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold');
      doc.text(new Date(invoice.issueDate).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      }), 60, yPos + 30);

      // Due Date Card
      doc.roundedRect(50 + cardSpacing, yPos, cardWidth, 60, 8).stroke('#e2e8f0').fill('#f8fafc');
      doc.fontSize(10).fillColor('#6b7280').font('Helvetica-Bold');
      doc.text('DUE DATE', 60 + cardSpacing, yPos + 10);
      doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold');
      doc.text(new Date(invoice.dueDate).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      }), 60 + cardSpacing, yPos + 30);

      // Status Card
      doc.roundedRect(50 + cardSpacing * 2, yPos, cardWidth, 60, 8).stroke('#e2e8f0').fill('#f8fafc');
      doc.fontSize(10).fillColor('#6b7280').font('Helvetica-Bold');
      doc.text('STATUS', 60 + cardSpacing * 2, yPos + 10);
      
      const statusColor = invoice.status === 'Paid' ? '#059669' : 
                         invoice.status === 'Sent' ? '#d97706' : '#6b7280';
      doc.fontSize(12).fillColor(statusColor).font('Helvetica-Bold');
      doc.text(invoice.status, 60 + cardSpacing * 2, yPos + 30);

      // Amount Due Card
      doc.roundedRect(50 + cardSpacing * 3, yPos, cardWidth, 60, 8).stroke('#e2e8f0').fill('#f8fafc');
      doc.fontSize(10).fillColor('#6b7280').font('Helvetica-Bold');
      doc.text('AMOUNT DUE', 60 + cardSpacing * 3, yPos + 10);
      doc.fontSize(14).fillColor('#8b5cf6').font('Helvetica-Bold');
      doc.text(`$${invoice.total.toFixed(2)}`, 60 + cardSpacing * 3, yPos + 30);

      // Items Table
      yPos = 400;
      
      // Table Title
      doc.fontSize(16).fillColor('#1f2937').font('Helvetica-Bold');
      doc.text('Invoice Items', 50, yPos);
      doc.rect(50, yPos + 25, 200, 2).fill('#8b5cf6');
      
      yPos += 45;

      // Table Header
      doc.rect(50, yPos, 495, 35).fill('#8b5cf6');
      doc.fontSize(12).fillColor('white').font('Helvetica-Bold');
      doc.text('DESCRIPTION', 60, yPos + 12);
      doc.text('QTY', 320, yPos + 12);
      doc.text('UNIT PRICE', 380, yPos + 12);
      doc.text('AMOUNT', 480, yPos + 12);

      yPos += 35;

      // Table Rows
      invoice.items.forEach((item, index) => {
        const rowColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
        doc.rect(50, yPos, 495, 30).fill(rowColor);
        
        doc.fontSize(11).fillColor('#1f2937').font('Helvetica-Bold');
        doc.text(item.name, 60, yPos + 10, { width: 200 });
        
        if (item.description) {
          doc.fontSize(9).fillColor('#6b7280').font('Helvetica');
          doc.text(item.description, 60, yPos + 22, { width: 200 });
        }
        
        doc.fontSize(11).fillColor('#1f2937').font('Helvetica');
        doc.text(item.quantity.toString(), 330, yPos + 10);
        doc.text(`$${item.price.toFixed(2)}`, 390, yPos + 10);
        doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 490, yPos + 10);
        
        yPos += 30;
      });

      // Totals Section
      yPos += 20;
      const totalsX = 350;
      const totalsWidth = 195;

      doc.roundedRect(totalsX, yPos, totalsWidth, 120, 12).stroke('#e2e8f0').fill('#f8fafc');

      const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      // Subtotal
      doc.fontSize(12).fillColor('#4b5563').font('Helvetica');
      doc.text('Subtotal', totalsX + 20, yPos + 20);
      doc.text(`$${subtotal.toFixed(2)}`, totalsX + totalsWidth - 70, yPos + 20);

      // Tax (if any)
      if (invoice.tax > 0) {
        doc.text('Tax', totalsX + 20, yPos + 40);
        doc.text(`$${invoice.tax.toFixed(2)}`, totalsX + totalsWidth - 70, yPos + 40);
      }

      // Discount (if any)
      if (invoice.discount > 0) {
        doc.text('Discount', totalsX + 20, yPos + 60);
        doc.text(`-$${invoice.discount.toFixed(2)}`, totalsX + totalsWidth - 70, yPos + 60);
      }

      // Total
      doc.rect(totalsX + 10, yPos + 80, totalsWidth - 20, 2).fill('#8b5cf6');
      doc.fontSize(16).fillColor('#4c1d95').font('Helvetica-Bold');
      doc.text('Total Amount', totalsX + 20, yPos + 90);
      doc.text(`$${invoice.total.toFixed(2)}`, totalsX + totalsWidth - 70, yPos + 90);

      // Notes (if any)
      if (invoice.notes) {
        yPos += 150;
        doc.roundedRect(50, yPos, 495, 60, 8).stroke('#f59e0b').fill('#fefce8');
        doc.rect(50, yPos, 6, 60).fill('#f59e0b');
        
        doc.fontSize(12).fillColor('#92400e').font('Helvetica-Bold');
        doc.text('Additional Notes', 70, yPos + 15);
        doc.fontSize(11).fillColor('#78350f').font('Helvetica');
        doc.text(invoice.notes, 70, yPos + 35, { width: 400 });
      }

      // Footer
      const footerY = 750;
      doc.rect(0, footerY, 595, 92).fill('#1e1b4b');
      
      doc.fontSize(16).fillColor('white').font('Helvetica-Bold');
      doc.text('Thank You for Your Business!', 50, footerY + 20, { align: 'center', width: 495 });
      doc.fontSize(12).fillColor('white').font('Helvetica');
      doc.text('We appreciate the opportunity to work with you.', 50, footerY + 45, { align: 'center', width: 495 });
      
      doc.fontSize(12).fillColor('white').font('Helvetica-Bold');
      doc.text('Powered by InvoX', 50, footerY + 70, { align: 'center', width: 495 });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

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
      template = 'invoiceTemplate',
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
      template,
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

    // Get template name from URL parameter or use invoice's template
    const template = req.params.template || invoice.template || 'invoiceTemplate';
    const allowedTemplates = ['invoiceTemplate', 'modernTemplate', 'creativeTemplate', 'minimalTemplate'];
    
    if (!allowedTemplates.includes(template)) {
      return res.status(400).json({ message: "Invalid template selected" });
    }

    const templatePath = path.join(
      __dirname,
      `../templates/${template}.ejs`
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
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu"
      ],
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
    let pdfMethod = '';

    // First try: Puppeteer PDF generation
    try {
      console.log("🎯 Attempting PDF generation with Puppeteer...");
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
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu"
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      await browser.close();
      
      pdfMethod = 'Puppeteer';
      console.log("✅ Puppeteer PDF generation successful!");
      
    } catch (puppeteerError) {
      console.error("❌ Puppeteer PDF Generation Failed:", puppeteerError.message);
      
      // Second try: PDFKit as fallback
      try {
        console.log("🎯 Attempting PDF generation with PDFKit...");
        pdfBuffer = await generatePDFWithPDFKit(invoice, company);
        pdfMethod = 'PDFKit';
        console.log("✅ PDFKit PDF generation successful!");
        
      } catch (pdfkitError) {
        console.error("❌ PDFKit PDF Generation Failed:", pdfkitError.message);
        
        // Final fallback: Send beautiful HTML email without PDF
        console.log("📧 Final fallback: Sending beautiful HTML email without PDF attachment...");
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const mailOptions = {
            from: `"${company?.name || "InvoX"}" <${process.env.EMAIL_USER}>`,
            to: invoice.clientEmail,
            subject: `💎 Invoice #${invoice.invoiceNumber} from ${company?.name || 'InvoX'}`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; overflow: hidden; color: #333;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 40px; text-align: center; color: white;">
                  <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #a855f7, #ec4899, #8b5cf6); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 24px; color: #1e1b4b;">X</div>
                    <div>
                      <div style="font-size: 28px; font-weight: 800;">InvoX</div>
                      <div style="font-size: 14px; opacity: 0.9;">Next-gen invoicing.</div>
                    </div>
                  </div>
                  <h1 style="font-size: 36px; margin: 0; font-weight: 800;">INVOICE</h1>
                  <p style="font-size: 18px; margin: 10px 0 0 0; opacity: 0.95;">#${invoice.invoiceNumber}</p>
                </div>

                <!-- Content -->
                <div style="background: white; padding: 40px;">
                  <h2 style="color: #1f2937; margin-bottom: 30px;">Hi ${invoice.clientName} 👋</h2>
                  
                  <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 30px; border-radius: 16px; border-left: 4px solid #8b5cf6; margin: 30px 0;">
                    <h3 style="color: #4c1d95; margin-bottom: 20px; font-size: 18px;">📄 Invoice Details</h3>
                    <div style="display: grid; gap: 15px;">
                      <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #6b7280;">Invoice Number:</strong>
                        <span style="color: #1f2937; font-weight: 600;">${invoice.invoiceNumber}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #6b7280;">Issue Date:</strong>
                        <span style="color: #1f2937;">${new Date(invoice.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #6b7280;">Due Date:</strong>
                        <span style="color: #1f2937; font-weight: 600;">${new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #6b7280;">Status:</strong>
                        <span style="color: ${invoice.status === 'Paid' ? '#059669' : invoice.status === 'Sent' ? '#d97706' : '#6b7280'}; font-weight: 700;">${invoice.status}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Items -->
                  <div style="margin: 30px 0;">
                    <h3 style="color: #1f2937; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #8b5cf6;">💼 Invoice Items</h3>
                    ${invoice.items.map(item => `
                      <div style="background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 3px solid #8b5cf6;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <div>
                            <strong style="color: #1f2937; font-size: 14px;">${item.name}</strong>
                            ${item.description ? `<div style="color: #6b7280; font-size: 12px; margin-top: 4px;">${item.description}</div>` : ''}
                          </div>
                          <div style="text-align: right;">
                            <div style="color: #1f2937; font-weight: 600;">${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Totals -->
                  <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 25px; border-radius: 16px; margin: 30px 0; border: 2px solid #e2e8f0;">
                    ${invoice.tax > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span style="color: #4b5563;">Tax:</span><span style="color: #1f2937; font-weight: 600;">$${invoice.tax.toFixed(2)}</span></div>` : ''}
                    ${invoice.discount > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span style="color: #4b5563;">Discount:</span><span style="color: #1f2937; font-weight: 600;">-$${invoice.discount.toFixed(2)}</span></div>` : ''}
                    <div style="border-top: 3px solid #8b5cf6; padding-top: 15px; margin-top: 15px;">
                      <div style="display: flex; justify-content: space-between;">
                        <span style="font-size: 20px; font-weight: 700; color: #4c1d95;">Total Amount:</span>
                        <span style="font-size: 20px; font-weight: 700; color: #4c1d95;">$${invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  ${invoice.notes ? `
                    <div style="background: linear-gradient(135deg, #fefce8, #fef3c7); padding: 20px; border-radius: 12px; border-left: 6px solid #f59e0b; margin: 30px 0;">
                      <h4 style="color: #92400e; margin-bottom: 10px;">📝 Additional Notes</h4>
                      <p style="color: #78350f; margin: 0; line-height: 1.6;">${invoice.notes}</p>
                    </div>
                  ` : ''}

                  <div style="text-align: center; margin: 40px 0; padding: 30px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 16px;">
                    <p style="color: #0369a1; font-size: 16px; margin: 0;">📧 <strong>PDF version temporarily unavailable</strong></p>
                    <p style="color: #0369a1; font-size: 14px; margin: 10px 0 0 0;">Please contact us if you need the PDF version of this invoice.</p>
                  </div>

                </div>

                <!-- Footer -->
                <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); color: white; padding: 30px; text-align: center;">
                  <h3 style="margin: 0 0 10px 0; font-size: 18px;">Thank You for Your Business! 🎉</h3>
                  <p style="margin: 0 0 20px 0; opacity: 0.9; font-size: 14px;">We appreciate the opportunity to work with you.</p>
                  <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
                    <div style="display: inline-flex; align-items: center; gap: 8px;">
                      <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #a855f7, #ec4899); border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px;">X</div>
                      <span style="font-weight: 700; font-size: 16px;">Powered by InvoX</span>
                    </div>
                  </div>
                </div>

              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          return res.json({ 
            message: "Invoice sent via beautiful email notification (PDF generation temporarily unavailable)",
            method: "HTML Email Fallback"
          });
          
        } catch (emailError) {
          console.error("❌ Final fallback email also failed:", emailError);
          return res.status(500).json({ 
            message: "Failed to send invoice email",
            error: process.env.NODE_ENV === 'development' ? emailError.message : 'Email sending error'
          });
        }
      }
    }

    // Send email with PDF attachment
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${company?.name || "InvoX"}" <${process.env.EMAIL_USER}>`,
      to: invoice.clientEmail,
      subject: `💎 Invoice #${invoice.invoiceNumber} from ${company?.name || 'InvoX'}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 40px; text-align: center; color: white;">
            <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #a855f7, #ec4899, #8b5cf6); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 24px; color: #1e1b4b;">X</div>
              <div>
                <div style="font-size: 28px; font-weight: 800;">InvoX</div>
                <div style="font-size: 14px; opacity: 0.9;">Next-gen invoicing.</div>
              </div>
            </div>
            <h1 style="font-size: 36px; margin: 0; font-weight: 800;">INVOICE ATTACHED</h1>
            <p style="font-size: 18px; margin: 10px 0 0 0; opacity: 0.95;">#${invoice.invoiceNumber}</p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 40px; text-align: center;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${invoice.clientName} 👋</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Your invoice is ready! Please find the beautiful PDF attached to this email.
            </p>
            
            <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 25px; border-radius: 16px; border-left: 4px solid #22c55e; margin: 30px 0;">
              <p style="color: #166534; font-size: 14px; margin: 0;">
                📎 <strong>PDF generated successfully using ${pdfMethod}</strong><br>
                Your invoice is attached as a beautiful, professional PDF document.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 25px; border-radius: 16px; margin: 30px 0;">
              <h3 style="color: #4c1d95; margin-bottom: 15px;">📋 Quick Summary</h3>
              <div style="display: grid; gap: 10px;">
                <div><strong style="color: #6b7280;">Amount Due:</strong> <span style="color: #8b5cf6; font-weight: 700; font-size: 18px;">$${invoice.total.toFixed(2)}</span></div>
                <div><strong style="color: #6b7280;">Due Date:</strong> <span style="color: #1f2937;">${new Date(invoice.dueDate).toLocaleDateString()}</span></div>
                <div><strong style="color: #6b7280;">Status:</strong> <span style="color: ${invoice.status === 'Paid' ? '#059669' : invoice.status === 'Sent' ? '#d97706' : '#6b7280'}; font-weight: 600;">${invoice.status}</span></div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); color: white; padding: 30px; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">Thank You for Your Business! 🎉</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.9;">We appreciate the opportunity to work with you.</p>
            <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
              <div style="display: inline-flex; align-items: center; gap: 8px;">
                <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #a855f7, #ec4899); border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px;">X</div>
                <span style="font-weight: 700;">Powered by InvoX</span>
              </div>
            </div>
          </div>

        </div>
      `,
      attachments: [
        {
          filename: `InvoX-Invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: `Invoice sent successfully via email with PDF attachment`,
      method: pdfMethod,
      attachment: `InvoX-Invoice-${invoice.invoiceNumber}.pdf`
    });

  } catch (error) {
    console.error("Send Email Error:", error);
    res.status(500).json({ message: "Failed to send invoice email" });
  }
};

// Get available invoice templates
const getInvoiceTemplates = async (req, res) => {
  try {
    const templates = [
      {
        id: 'invoiceTemplate',
        name: 'Classic',
        description: 'Professional gradient design with modern styling',
        preview: '/api/templates/preview/invoiceTemplate.png'
      },
      {
        id: 'modernTemplate',
        name: 'Modern',
        description: 'Clean and contemporary design with elegant typography',
        preview: '/api/templates/preview/modernTemplate.png'
      },
      {
        id: 'creativeTemplate',
        name: 'Creative',
        description: 'Bold and colorful design with playful animations',
        preview: '/api/templates/preview/creativeTemplate.png'
      },
      {
        id: 'minimalTemplate',
        name: 'Minimal',
        description: 'Simple and clean design focused on readability',
        preview: '/api/templates/preview/minimalTemplate.png'
      }
    ];

    res.json(templates);
  } catch (error) {
    console.error("Get Templates Error:", error);
    res.status(500).json({ message: "Server error" });
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
  getInvoiceTemplates,
};
