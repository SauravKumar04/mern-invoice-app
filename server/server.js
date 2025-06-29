const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middlewares

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ your frontend origin
    credentials: true,               // ✅ allow cookies, headers, etc.
  })
);


app.use(express.json());

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
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });