# QR Code Email Troubleshooting Guide

## Issue: QR Code Email Not Working (PDF Email Working)

### Quick Diagnosis Steps

1. **Test QR Code Email Configuration**
   ```bash
   # Make a GET request to test endpoint
   curl -X GET http://localhost:3000/api/payments/test-qr-config \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Check Environment Variables**
   ```bash
   # In your server/.env file, verify:
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:5173
   ```

### Common Issues & Solutions

#### 1. Email Authentication Failed (Most Common)
**Error**: `EMAIL_AUTH_FAILED` or `Error: Invalid login: 535-5.7.8 Username and Password not accepted`

**Solution**:
- ✅ Use Gmail App Password instead of regular password
- ✅ Enable 2-Factor Authentication on Google account
- ✅ Generate App Password in Google Account settings
- ✅ Use the 16-character App Password in `EMAIL_PASS`

**Steps to Generate Gmail App Password**:
1. Go to Google Account settings
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Select app → Mail
4. Generate password → Copy 16-character password
5. Use this password in `EMAIL_PASS`

#### 2. QR Code Generation Issues
**Error**: `QR_GENERATION_FAILED`

**Solution**:
- ✅ Verify `qrcode` package is installed: `npm list qrcode`
- ✅ Check if QR data URL is valid
- ✅ Ensure payment methods are configured in Company Settings

#### 3. Email Transporter Configuration
**Error**: `EMAIL_NETWORK_ERROR`

**Solution**:
- ✅ Check internet connection
- ✅ Verify Gmail SMTP settings
- ✅ Ensure port 587 is not blocked

#### 4. Missing Environment Variables
**Error**: `EMAIL_CONFIG_MISSING`

**Solution**:
- ✅ Add `EMAIL_USER` and `EMAIL_PASS` to server/.env
- ✅ Add `FRONTEND_URL` for QR code links
- ✅ Restart server after adding variables

### Debugging Steps

#### Step 1: Test Email Configuration
```bash
# Test the email configuration
curl -X GET http://localhost:3000/api/payments/test-qr-config \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "message": "QR code email configuration test passed!",
  "results": {
    "emailTransporter": "✅ Verified",
    "qrCodeGeneration": "✅ Working",
    "qrCodeSize": "3134 bytes"
  }
}
```

#### Step 2: Compare with PDF Email
Since PDF emails work, the issue is likely:
- QR code generation failing
- Different email configuration in QR function
- Missing QR code attachment
- Invalid QR data URL

#### Step 3: Check Server Logs
Look for these log messages:
```
🎯 Generating payment QR code for invoice: [ID]
🔗 Payment QR data: [URL]
✅ Email transporter configuration verified
📧 Sending payment QR code to: [EMAIL]
✅ Payment QR code email sent successfully!
```

If missing any of these, the issue is at that step.

### Code Comparison: PDF vs QR Email

**PDF Email** (Working):
- Uses `nodemailer.createTransport()` with verification
- Has comprehensive error handling
- Includes debug logging
- Verifies transporter before sending

**QR Email** (Fixed):
- Now uses same transporter configuration
- Added verification step
- Enhanced error handling
- Improved logging

### Test Script

Create a test file to verify QR email functionality:

```javascript
// test-qr-email.js
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

async function testQREmail() {
  try {
    // Test QR generation
    const qrBuffer = await QRCode.toBuffer('https://example.com/test', {
      type: 'image/png',
      quality: 0.92,
      width: 300
    });
    console.log('✅ QR generation:', qrBuffer.length, 'bytes');

    // Test email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.verify();
    console.log('✅ Email transporter verified');

    // Test sending
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'test@example.com',
      subject: 'QR Test',
      html: '<h1>QR Code Test</h1>',
      attachments: [{
        filename: 'qr-test.png',
        content: qrBuffer
      }]
    });
    console.log('✅ Test email sent');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testQREmail();
```

### Production Deployment Issues

If working locally but not in production:

1. **Environment Variables**: Verify all variables are set in production
2. **Email Service**: Some hosting providers block SMTP
3. **Firewall**: Check if port 587 is blocked
4. **Rate Limiting**: Gmail may limit emails from new IPs

### Alternative Solutions

If Gmail continues to fail:

1. **Use SendGrid**:
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   ```

2. **Use AWS SES**:
   ```javascript
   const AWS = require('aws-sdk');
   const ses = new AWS.SES();
   ```

3. **Use Mailgun**:
   ```javascript
   const mailgun = require('mailgun-js');
   const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});
   ```

### Testing Checklist

- [ ] Environment variables set correctly
- [ ] Gmail App Password generated and used
- [ ] QR code generation working
- [ ] Email transporter verified
- [ ] Test endpoint returns success
- [ ] Server logs show all steps completing
- [ ] Email received in inbox (check spam folder)

### Need Help?

If issue persists after following this guide:

1. Check server logs for specific error messages
2. Test with the `/test-qr-config` endpoint
3. Compare QR code email with working PDF email
4. Verify all environment variables are set
5. Try alternative email service if Gmail continues to fail

## Key Differences Fixed

1. **Added transporter verification** (like PDF email)
2. **Enhanced error handling** (matching PDF email)
3. **Added debug logging** (like PDF email)
4. **Improved error messages** (more specific)
5. **Added troubleshooting info** (in error response)

The QR code email should now work the same as PDF email!