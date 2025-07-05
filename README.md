# InvoX - Advanced Invoice Management System
*Next-generation invoicing with QR payment integration*

## 🚀 Overview

InvoX is a comprehensive, modern invoice management system that revolutionizes how businesses handle billing and payments. Built with React.js and Node.js, it offers professional invoice generation, multi-template support, and innovative QR code payment solutions.

## ✨ Core Features

### 📊 **Dashboard & Analytics**
- **Modern Dashboard**: Real-time business overview with animated statistics
- **Revenue Tracking**: Comprehensive revenue analytics and growth metrics
- **Invoice Statistics**: Track total invoices, paid amounts, and status distribution
- **Recent Activity**: Monitor latest invoice activities and changes
- **Quick Actions**: Fast access to invoice creation and management

### 📋 **Advanced Invoice Management**
- **CRUD Operations**: Complete invoice lifecycle management
- **Multiple Templates**: 4 professional invoice templates
  - **Classic**: Professional gradient design with modern styling
  - **Modern**: Clean contemporary design with elegant typography
  - **Creative**: Bold colorful design with playful animations
  - **Minimal**: Simple clean design focused on readability
- **Status Management**: Draft, Sent, Paid status tracking
- **Due Date Monitoring**: Overdue and upcoming payment alerts
- **Item Management**: Detailed line items with descriptions and calculations

### 💳 **Revolutionary QR Payment System**
*The standout feature that sets InvoX apart*

#### **Multi-Payment QR Codes**
- **Universal Payment Hub**: Single QR code for multiple payment options
- **Instant Generation**: Real-time QR code creation for invoices
- **Email Integration**: Automated QR code delivery via beautiful emails
- **Mobile Optimized**: QR codes optimized for mobile scanning

#### **Supported Payment Methods**
- **Credit/Debit Cards**: Stripe integration for secure card payments
- **Digital Wallets**: PayPal, Venmo, Cash App support
- **Bank Transfers**: Zelle integration for direct bank transfers
- **UPI Payments**: Google Pay and PhonePe for Indian market
- **Cryptocurrency**: Bitcoin payment support
- **Multiple Options**: Comprehensive payment hub with all methods

#### **QR Code Features**
- **Beautiful Design**: Purple-themed QR codes with custom branding
- **High Quality**: 300px resolution with perfect readability
- **Secure Links**: Direct links to payment platforms with pre-filled amounts
- **Email Delivery**: Gorgeous HTML emails with embedded QR codes
- **Download Option**: Save QR codes as PNG files

### 📧 **Professional Email System**
- **Multi-Template Emails**: Beautiful responsive email templates
- **PDF Attachments**: Automatic PDF generation and attachment
- **QR Code Emails**: Dedicated payment QR code email templates
- **Fallback Systems**: Multiple PDF generation methods for reliability
- **SMTP Integration**: Gmail integration with app password support

### 🎨 **Advanced PDF Generation**
- **Multiple Engines**: html-pdf-node, Puppeteer, and PDFKit fallbacks
- **Template-Based**: Generate PDFs using different invoice templates
- **High Quality**: Professional-grade PDF output
- **Calculation Accuracy**: Precise tax and discount calculations
- **Brand Consistency**: Company branding throughout documents

### 🏢 **Company Management**
- **Complete Business Profiles**: Company information management
- **Payment Configuration**: Setup for all payment methods
- **Contact Information**: Address, phone, email, website
- **UPI Integration**: Configure Google Pay and PhonePe UPI IDs
- **Cryptocurrency Setup**: Bitcoin wallet configuration
- **Branding Options**: Company logo and styling preferences

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level access control
- **User Management**: Registration, login, password reset
- **OTP Verification**: Two-factor authentication support
- **Secure Passwords**: Bcrypt encryption for user data

### 🎯 **User Experience**
- **Responsive Design**: Mobile-first responsive interface
- **Modern UI**: Glass-morphism and gradient designs
- **Smooth Animations**: Framer Motion powered transitions
- **Loading States**: Beautiful loading indicators and skeletons
- **Toast Notifications**: Real-time feedback for user actions
- **Dark Mode Ready**: Prepared for dark theme implementation

## 🛠 Tech Stack

### **Frontend**
- **React 19**: Latest React with modern hooks
- **Vite**: Lightning-fast development and building
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful modern icons
- **React Router**: Client-side routing
- **React Toastify**: Notification system
- **Formik & Yup**: Form handling and validation

### **Backend**
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **Nodemailer**: Email sending capabilities
- **Multer**: File upload handling
- **QRCode**: QR code generation library

### **PDF Generation**
- **html-pdf-node**: Primary PDF engine
- **Puppeteer**: Chrome headless PDF generation
- **PDFKit**: Programmatic PDF creation fallback
- **EJS**: Template engine for HTML rendering

### **Payment Integration**
- **Stripe**: Credit card payment processing
- **PayPal**: Digital wallet integration
- **UPI**: Google Pay and PhonePe support
- **Bitcoin**: Cryptocurrency payment options

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 16+ installed
- MongoDB database running
- Gmail account with app password (for email features)

### **Backend Setup**
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Configure environment variables
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
MONGO_URI=mongodb://localhost:27017/invoix
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173

# Start server
npm start
```

### **Frontend Setup**
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment variables file
echo "VITE_API=http://localhost:4000/api" > .env.local

# Start development server
npm run dev
```

### **Environment Variables**

#### **Server (.env)**
```env
# Database
MONGO_URI=mongodb://localhost:27017/invoix

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# Application
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=4000
```

#### **Client (.env.local)**
```env
VITE_API=http://localhost:4000/api
```

## 📱 Usage Guide

### **Getting Started**
1. **Register Account**: Create your business account
2. **Setup Company**: Configure business information and payment methods
3. **Create Invoice**: Generate your first invoice with items and details
4. **Send QR Payment**: Generate and send QR code for instant payments
5. **Track Status**: Monitor invoice status and payments

### **Payment QR Code Workflow**
1. Create invoice with complete details
2. Navigate to invoice view
3. Click "Send Payment QR Code"
4. Select payment method or "All Methods"
5. Add custom message (optional)
6. Send beautiful email with QR code
7. Client scans QR code for instant payment

### **Template Selection**
- Choose from 4 professional templates
- Each template offers unique styling
- Templates work with both PDF and email generation
- Consistent branding across all templates

## 🎨 Key Features Deep Dive

### **Payment Hub**
The Payment Hub is a revolutionary feature that creates a single landing page with all payment options:
- **Universal Access**: One QR code, multiple payment methods
- **Mobile Optimized**: Perfect for smartphone scanning
- **Secure Processing**: Direct integration with payment providers
- **Global Support**: Works worldwide with local payment methods

### **Email Templates**
Professional email templates that include:
- **Responsive Design**: Perfect on all devices
- **QR Code Integration**: Embedded QR codes with styling
- **Brand Consistency**: Company branding throughout
- **Multiple Formats**: HTML with PDF attachments or standalone

### **PDF Generation**
Robust PDF generation with multiple fallback systems:
- **Primary**: html-pdf-node for template-based generation
- **Secondary**: Puppeteer for complex layouts
- **Fallback**: PDFKit for guaranteed generation
- **Quality**: Professional output suitable for business use

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: Bcrypt hashing for user passwords
- **Route Protection**: Private routes with authentication middleware
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Variables**: Sensitive data protection

## 🌟 Advanced Capabilities

### **Multi-Currency Support**
- USD primary currency
- INR support for UPI payments
- Bitcoin cryptocurrency option
- Extensible for additional currencies

### **Global Payment Methods**
- **US**: PayPal, Venmo, Cash App, Zelle
- **India**: Google Pay, PhonePe (UPI)
- **Global**: Stripe, Bitcoin
- **Banking**: Direct bank transfers

### **Professional Templates**
- **Gradient Designs**: Modern visual appeal
- **Company Branding**: Logo and color integration
- **Calculation Accuracy**: Precise tax and discount handling
- **Mobile Responsive**: Perfect on all screen sizes

## 📊 Performance & Reliability

- **Fast Loading**: Optimized for speed with lazy loading
- **Error Handling**: Comprehensive error management
- **Fallback Systems**: Multiple PDF generation methods
- **Email Reliability**: SMTP with retry mechanisms
- **Database Optimization**: Efficient MongoDB queries

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **QR Code Library**: qrcode package for QR generation
- **UI Icons**: Lucide React for beautiful icons
- **Email Templates**: Responsive HTML email designs
- **PDF Generation**: Multiple engines for reliability
- **Payment Providers**: Integration with major payment platforms

## 🚀 Deployment

### **Production Setup**
1. Configure production environment variables
2. Set up MongoDB Atlas or production database
3. Configure email service (Gmail with app password)
4. Deploy backend to platform like Render or Railway
5. Deploy frontend to Netlify or Vercel
6. Update CORS origins for production URLs

### **Recommended Platforms**
- **Backend**: Render, Railway, or Heroku
- **Frontend**: Netlify, Vercel, or AWS S3
- **Database**: MongoDB Atlas
- **Email**: Gmail with app passwords

---

**InvoX** - Revolutionizing invoice management with modern technology and seamless payment experiences. 

*Built with ❤️ for businesses that value efficiency and professionalism.*