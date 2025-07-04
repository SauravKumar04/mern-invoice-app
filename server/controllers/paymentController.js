const QRCode = require('qrcode');
const nodemailer = require("nodemailer");
const Invoice = require("../models/Invoice");
const Company = require("../models/Company");
const fs = require('fs');
const path = require('path');

// Generate payment QR code and send via email
const generateAndSendPaymentQR = async (req, res) => {
  try {
    const { id: invoiceId } = req.params;
    const { paymentMethod = 'multiple', customMessage = '' } = req.body;

    console.log("🎯 Generating payment QR code for invoice:", invoiceId);

    // Get invoice details
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Check if user owns this invoice
    if (invoice.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to access this invoice" });
    }

    // Get company details
    const company = await Company.findOne({ user: req.user.userId });

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        message: "Email configuration missing. Please configure email settings.",
        error: "EMAIL_CONFIG_MISSING"
      });
    }

    // Calculate payment details
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = subtotal * (invoice.tax / 100);
    const discountAmount = subtotal * (invoice.discount / 100);
    const totalAmount = subtotal + taxAmount - discountAmount;

    // Generate payment URLs for different methods
    const paymentData = {
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      amount: totalAmount.toFixed(2),
      currency: 'USD',
      dueDate: invoice.dueDate,
      companyName: company?.name || 'Your Company',
      methods: {
        paypal: `https://paypal.me/${company?.paypalHandle || 'yourcompany'}/${totalAmount.toFixed(2)}`,
        venmo: `https://venmo.com/${company?.venmoHandle || 'yourcompany'}?txn=pay&amount=${totalAmount.toFixed(2)}&note=Invoice%20${invoice.invoiceNumber}`,
        cashapp: `https://cash.app/$${company?.cashappHandle || 'yourcompany'}/${totalAmount.toFixed(2)}`,
        zelle: `mailto:${company?.zelleEmail || company?.email || 'payment@yourcompany.com'}?subject=Payment%20for%20Invoice%20${invoice.invoiceNumber}&body=Amount:%20$${totalAmount.toFixed(2)}`,
        stripe: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pay/${invoiceId}`,
        bitcoin: `bitcoin:${company?.bitcoinAddress || ''}?amount=${(totalAmount * 0.000025).toFixed(8)}&label=Invoice%20${invoice.invoiceNumber}`,
        multiple: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-options/${invoiceId}`
      }
    };

    // Select payment URL based on method
    let qrCodeData = paymentData.methods[paymentMethod] || paymentData.methods.multiple;
    
    // If multiple payment options, create a comprehensive payment page URL
    if (paymentMethod === 'multiple') {
      qrCodeData = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-hub/${invoiceId}?amount=${totalAmount}&invoice=${invoice.invoiceNumber}&client=${encodeURIComponent(invoice.clientName)}`;
    }

    console.log("🔗 Payment QR data:", qrCodeData);

    // Generate QR code as base64 image
    const qrCodeOptions = {
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#4C1D95',  // Purple color
        light: '#FFFFFF'  // White background
      },
      width: 300
    };

    const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, qrCodeOptions);
    const qrCodeBase64 = qrCodeBuffer.toString('base64');

    // Setup email transporter
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { 
        rejectUnauthorized: false 
      }
    });

    // Create beautiful email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment QR Code - Invoice ${invoice.invoiceNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <div style="background: white; border-radius: 15px 15px 0 0; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
              💳 Payment QR Code
            </div>
            <p style="color: #6B7280; font-size: 16px; margin: 0;">Scan to pay instantly • Invoice #${invoice.invoiceNumber}</p>
          </div>

          <!-- QR Code Section -->
          <div style="background: white; padding: 40px; text-align: center; border-left: 4px solid #8B5CF6;">
            <div style="background: linear-gradient(135deg, #F3F4F6, #E5E7EB); padding: 20px; border-radius: 15px; display: inline-block; margin-bottom: 20px;">
              <img src="data:image/png;base64,${qrCodeBase64}" alt="Payment QR Code" style="display: block; margin: 0 auto; border: 3px solid white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);" />
            </div>
            
            <h2 style="color: #4C1D95; margin: 20px 0 10px 0; font-size: 24px;">📱 Simply Scan & Pay</h2>
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Point your phone camera at the QR code above or use any QR scanner app to access secure payment options instantly.
            </p>

            <!-- Payment Amount -->
            <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);">
              <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Amount Due</div>
              <div style="font-size: 32px; font-weight: bold;">$${totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <!-- Invoice Details -->
          <div style="background: white; padding: 30px; border-left: 4px solid #F59E0B;">
            <h3 style="color: #4C1D95; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">📋</span> Invoice Details
            </h3>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #F3F4F6;">
              <span style="color: #6B7280; font-weight: 500;">Invoice Number:</span>
              <span style="color: #1F2937; font-weight: 600;">${invoice.invoiceNumber}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #F3F4F6;">
              <span style="color: #6B7280; font-weight: 500;">Client:</span>
              <span style="color: #1F2937; font-weight: 600;">${invoice.clientName}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #F3F4F6;">
              <span style="color: #6B7280; font-weight: 500;">Due Date:</span>
              <span style="color: #1F2937; font-weight: 600;">${new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0;">
              <span style="color: #6B7280; font-weight: 500;">From:</span>
              <span style="color: #1F2937; font-weight: 600;">${company?.name || 'InvoX'}</span>
            </div>
          </div>

          <!-- Payment Methods -->
          <div style="background: white; padding: 30px; border-left: 4px solid #EC4899;">
            <h3 style="color: #4C1D95; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">💼</span> Available Payment Methods
            </h3>
            
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; padding: 12px; background: #F9FAFB; border-radius: 8px; border-left: 3px solid #3B82F6;">
                <span style="margin-right: 12px; font-size: 20px;">💳</span>
                <span style="color: #374151; font-weight: 500;">Credit/Debit Cards (Stripe)</span>
              </div>
              
              <div style="display: flex; align-items: center; padding: 12px; background: #F9FAFB; border-radius: 8px; border-left: 3px solid #0070BA;">
                <span style="margin-right: 12px; font-size: 20px;">🏦</span>
                <span style="color: #374151; font-weight: 500;">PayPal</span>
              </div>
              
              <div style="display: flex; align-items: center; padding: 12px; background: #F9FAFB; border-radius: 8px; border-left: 3px solid #3D95CE;">
                <span style="margin-right: 12px; font-size: 20px;">📱</span>
                <span style="color: #374151; font-weight: 500;">Venmo</span>
              </div>
              
              <div style="display: flex; align-items: center; padding: 12px; background: #F9FAFB; border-radius: 8px; border-left: 3px solid #00D632;">
                <span style="margin-right: 12px; font-size: 20px;">💰</span>
                <span style="color: #374151; font-weight: 500;">Cash App</span>
              </div>
              
              <div style="display: flex; align-items: center; padding: 12px; background: #F9FAFB; border-radius: 8px; border-left: 3px solid #F7931A;">
                <span style="margin-right: 12px; font-size: 20px;">₿</span>
                <span style="color: #374151; font-weight: 500;">Bitcoin & More</span>
              </div>
            </div>
          </div>

          ${customMessage ? `
          <!-- Custom Message -->
          <div style="background: white; padding: 30px; border-left: 4px solid #8B5CF6;">
            <h3 style="color: #4C1D95; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">💬</span> Message from ${company?.name || 'InvoX'}
            </h3>
            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0; font-style: italic; background: #F9FAFB; padding: 15px; border-radius: 8px;">
              "${customMessage}"
            </p>
          </div>
          ` : ''}

          <!-- Security Notice -->
          <div style="background: white; padding: 25px; border-radius: 0 0 15px 15px; text-align: center; border-top: 1px solid #E5E7EB;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
              <span style="color: #10B981; margin-right: 8px; font-size: 20px;">🔒</span>
              <span style="color: #059669; font-weight: 600; font-size: 16px;">Secure Payment</span>
            </div>
            <p style="color: #6B7280; font-size: 14px; margin: 0; line-height: 1.5;">
              This QR code leads to secure payment options. All transactions are encrypted and protected.
              <br>Questions? Reply to this email or contact ${company?.email || process.env.EMAIL_USER}.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding: 20px;">
            <p style="color: white; font-size: 14px; margin: 0; opacity: 0.8;">
              Powered by <strong>InvoX</strong> • Modern Invoice Management
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email with QR code
    const emailOptions = {
      from: `"${company?.name || "InvoX"} Payment" <${process.env.EMAIL_USER}>`,
      to: invoice.clientEmail,
      subject: `💳 Payment QR Code - Invoice ${invoice.invoiceNumber} ($${totalAmount.toFixed(2)})`,
      html: emailHTML,
      attachments: [
        {
          filename: `payment-qr-${invoice.invoiceNumber}.png`,
          content: qrCodeBuffer,
          cid: 'qrcode'
        }
      ]
    };

    console.log(`📧 Sending payment QR code to: ${invoice.clientEmail}`);
    await transporter.sendMail(emailOptions);
    console.log("✅ Payment QR code email sent successfully!");

    res.json({
      success: true,
      message: "Payment QR code sent successfully!",
      data: {
        invoiceNumber: invoice.invoiceNumber,
        amount: totalAmount.toFixed(2),
        recipient: invoice.clientEmail,
        paymentMethod: paymentMethod,
        qrCodeData: qrCodeData,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Error generating/sending payment QR code:", error);
    
    let errorMessage = "Failed to generate and send payment QR code";
    let errorCode = "QR_GENERATION_FAILED";
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      errorMessage = "Email authentication failed. Please check your email configuration.";
      errorCode = "EMAIL_AUTH_FAILED";
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = "Network error. Unable to send email.";
      errorCode = "EMAIL_NETWORK_ERROR";
    }
    
    res.status(500).json({
      success: false,
      error: errorCode,
      message: errorMessage,
      details: error.message
    });
  }
};

// Generate QR code only (without sending email)
const generatePaymentQR = async (req, res) => {
  try {
    const { id: invoiceId } = req.params;
    const { paymentMethod = 'multiple' } = req.query;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const company = await Company.findOne({ user: req.user.userId });
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = subtotal * (invoice.tax / 100);
    const discountAmount = subtotal * (invoice.discount / 100);
    const totalAmount = subtotal + taxAmount - discountAmount;

    // Payment URL based on method
    let qrCodeData = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-hub/${invoiceId}?amount=${totalAmount}&invoice=${invoice.invoiceNumber}`;
    
    if (paymentMethod !== 'multiple') {
      const paymentMethods = {
        paypal: `https://paypal.me/${company?.paypalHandle || 'yourcompany'}/${totalAmount.toFixed(2)}`,
        venmo: `https://venmo.com/${company?.venmoHandle || 'yourcompany'}?txn=pay&amount=${totalAmount.toFixed(2)}`,
        cashapp: `https://cash.app/$${company?.cashappHandle || 'yourcompany'}/${totalAmount.toFixed(2)}`,
        stripe: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pay/${invoiceId}`
      };
      qrCodeData = paymentMethods[paymentMethod] || qrCodeData;
    }

    const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, {
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#4C1D95',
        light: '#FFFFFF'
      },
      width: 300
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="payment-qr-${invoice.invoiceNumber}.png"`);
    res.send(qrCodeBuffer);

  } catch (error) {
    console.error("❌ Error generating QR code:", error);
    res.status(500).json({ message: "Failed to generate QR code", error: error.message });
  }
};

module.exports = {
  generateAndSendPaymentQR,
  generatePaymentQR
};