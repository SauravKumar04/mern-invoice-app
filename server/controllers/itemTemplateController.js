const ItemTemplate = require("../models/ItemTemplate");

// Create new item template
const createItemTemplate = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;

    const template = new ItemTemplate({
      user: req.user.userId,
      name,
      description,
      quantity,
      price,
    });

    const saved = await template.save();
    res.status(201).json({ message: "Template created", template: saved });
  } catch (error) {
    console.error("Create Template Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all templates for logged-in user
const getItemTemplates = async (req, res) => {
  try {
    const templates = await ItemTemplate.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    console.error("Fetch Templates Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete template
const deleteItemTemplate = async (req, res) => {
  try {
    const deleted = await ItemTemplate.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deleted) return res.status(404).json({ message: "Template not found" });

    res.json({ message: "Template deleted" });
  } catch (error) {
    console.error("Delete Template Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createItemTemplate,
  getItemTemplates,
  deleteItemTemplate,
};
