import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Plant from "../models/plantModel.js";

const router = express.Router();

// ==============================
// ✅ ADD NEW PLANT
// ==============================
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, image, category } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const plant = await Plant.create({
      name,
      description,
      image,
      category: category || "Flower", // default category
      user: req.user._id, // associate with logged-in user
    });

    return res.status(201).json(plant);
  } catch (error) {
    console.error("Error adding plant:", error.message);
    return res.status(400).json({ message: error.message });
  }
});

// ==============================
// ✅ GET ALL PLANTS (Home page)
// ==============================
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find({}).sort({ createdAt: -1 }); // newest first
    return res.json(plants);
  } catch (error) {
    console.error("Error fetching all plants:", error.message);
    return res.status(500).json({ message: "Error fetching plants" });
  }
});

// ==============================
// ✅ GET LOGGED-IN USER’S PLANTS (Dashboard)
// ==============================
router.get("/user", protect, async (req, res) => {
  try {
    const plants = await Plant.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(plants);
  } catch (error) {
    console.error("Error fetching user plants:", error.message);
    return res.status(500).json({ message: "Error fetching user plants" });
  }
});

// ==============================
// ✅ DELETE PLANT
// ==============================
router.delete("/:id", protect, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    // Ensure only the owner can delete
    if (plant.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this plant" });
    }

    await Plant.findByIdAndDelete(req.params.id);
    return res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error.message);
    return res.status(500).json({ message: "Server error while deleting plant" });
  }
});

export default router;
