import Plant from "../models/plantModel.js";

// Get all plants (optional search)
export const getPlants = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) query = { name: { $regex: search, $options: "i" } };

    const plants = await Plant.find(query);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a plant
export const addPlant = async (req, res) => {
  const { name, category, description, imageUrl } = req.body;
  try {
    const plant = await Plant.create({ name, category, description, imageUrl });
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a plant
export const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a plant
export const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json({ message: "Plant deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
