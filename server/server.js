const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-invoice-app.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const companyRoutes = require("./routes/companyRoutes");
const itemTemplateRoutes = require("./routes/itemTemplateRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/items", itemTemplateRoutes);

// ✅ Start server only after MongoDB connects
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
