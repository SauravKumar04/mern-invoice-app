# Email Sending Troubleshooting Guide

## 🔧 Issue Fixed: Email Configuration and Setup

### What Was Wrong
1. **Missing Environment Variables**: No `.env` file or incorrect email configuration
2. **Gmail Authentication Issues**: Using regular password instead of App Password
3. **Poor Error Handling**: No clear error messages for debugging
4. **Network Configuration**: Incorrect SMTP settings for Gmail

### What Was Fixed ✅

#### 1. Environment Configuration
- ✅ Created/updated `.env` file with proper email settings
- ✅ Added email configuration validation
- ✅ Enhanced error messages for missing configuration

#### 2. Gmail SMTP Configuration  
- ✅ Added proper Gmail SMTP settings:
  - Host: `smtp.gmail.com`
  - Port: `587`
  - Secure: `false`
  - TLS settings for better compatibility
- ✅ Added connection verification before sending
- ✅ Enhanced transporter configuration with debug options

#### 3. Error Handling & Debugging
- ✅ Added specific error codes for different failure types
- ✅ Detailed troubleshooting information in API responses
- ✅ Console logging for better debugging
- ✅ Email transporter verification

## 📧 Gmail Setup Requirements

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "2-Step Verification"
3. Follow the setup process to enable 2FA

### Step 2: Generate App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "App passwords"
3. Select "Mail" as the app
4. Copy the generated 16-character password
5. Use this password in your `.env` file as `EMAIL_PASS`

### Step 3: Update .env File
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## 🚨 Common Error Codes & Solutions

### Error: `EMAIL_AUTH_FAILED` (Code 535)
**Cause**: Authentication failed with Gmail
**Solutions**:
1. ✅ Use Gmail App Password instead of regular password
2. ✅ Ensure 2-Factor Authentication is enabled
3. ✅ Double-check EMAIL_USER and EMAIL_PASS in .env
4. ✅ Generate a new App Password if current one isn't working

### Error: `EMAIL_NETWORK_ERROR` (ENOTFOUND/ECONNREFUSED)
**Cause**: Network connectivity issues
**Solutions**:
1. ✅ Check internet connection
2. ✅ Verify firewall isn't blocking port 587
3. ✅ Try connecting from a different network
4. ✅ Check if corporate firewall blocks SMTP

### Error: `EMAIL_INVALID_RECIPIENT` (Code 550)
**Cause**: Invalid or non-existent email address
**Solutions**:
1. ✅ Verify recipient email address is correct
2. ✅ Check for typos in email address
3. ✅ Ensure email domain exists and accepts mail

### Error: `EMAIL_CONFIG_MISSING`
**Cause**: Missing environment variables
**Solutions**:
1. ✅ Ensure `.env` file exists in server directory
2. ✅ Check `EMAIL_USER` and `EMAIL_PASS` are set
3. ✅ Restart server after updating .env file
4. ✅ Verify environment variables are loaded with `console.log(process.env.EMAIL_USER)`

## 🧪 Testing Email Configuration

### Method 1: Test Endpoint
Create a simple test route to verify email configuration:

```javascript
// Add to server/routes/invoiceRoutes.js
router.post("/test-email", protect, async (req, res) => {
  try {
    const testEmail = req.body.email || req.user.email;
    
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.verify();
    
    await transporter.sendMail({
      from: `"InvoX Test" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: "✅ InvoX Email Test Successful",
      text: "This is a test email to verify your email configuration is working correctly."
    });

    res.json({ 
      success: true, 
      message: "Test email sent successfully",
      recipient: testEmail
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

### Method 2: Console Testing
Run this in your server console:

```bash
# Check environment variables
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);"
```

## 🔄 Alternative Email Providers

If Gmail continues to have issues, consider these alternatives:

### SendGrid (Recommended for Production)
```javascript
// Install: npm install @sendgrid/mail
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'recipient@example.com',
  from: 'sender@example.com',
  subject: 'Invoice from InvoX',
  html: '<strong>Your invoice is ready!</strong>',
};

await sgMail.send(msg);
```

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## 🏃‍♂️ Quick Fix Checklist

1. **✅ Check .env file exists and has correct values**
2. **✅ Use Gmail App Password (not regular password)**
3. **✅ Enable 2-Factor Authentication on Google account**
4. **✅ Restart server after changing .env**
5. **✅ Test with a simple email first**
6. **✅ Check server console for detailed error messages**
7. **✅ Verify recipient email address is valid**
8. **✅ Check network/firewall settings**

## 📊 Monitoring & Logs

The enhanced email system now provides detailed logging:

```bash
# Success logs
✅ Email transporter configuration verified
📧 Sending email to recipient@example.com...
✅ Email sent successfully!

# Error logs
❌ Email configuration missing: EMAIL_USER or EMAIL_PASS not set
❌ Email transporter verification failed: Invalid login
❌ Email authentication failed. Please check your Gmail App Password.
```

## 🎯 Production Recommendations

1. **Use Environment Variables**: Never hardcode credentials
2. **Use SendGrid/Mailgun**: More reliable than Gmail for production
3. **Implement Rate Limiting**: Prevent email spam
4. **Add Email Queue**: Use Redis/Bull for email queuing
5. **Monitor Email Delivery**: Track bounces and delivery rates
6. **Use Email Templates**: Professional HTML templates
7. **Add Unsubscribe Links**: For compliance

---

## Support

If you continue to experience issues:
1. Check the server console for detailed error messages
2. Test with the provided test endpoint
3. Verify your Gmail App Password is working
4. Consider using an alternative email service for production

The email system should now work reliably with proper Gmail configuration! 🚀