const Material = require("../models/Material");

const uploadMaterial = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const material = await Material.create({
      title,
      description,
      subject,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Material uploaded successfully",
      material,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate("uploadedBy", "name email role");
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadMaterial,
  getAllMaterials,
};