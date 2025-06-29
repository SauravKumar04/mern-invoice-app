const mongoose = require("mongoose");

const itemTemplateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItemTemplate", itemTemplateSchema);
