const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createItemTemplate,
  getItemTemplates,
  deleteItemTemplate,
} = require("../controllers/itemTemplateController");

router.post("/", protect, createItemTemplate);
router.get("/", protect, getItemTemplates);
router.delete("/:id", protect, deleteItemTemplate);

module.exports = router;
