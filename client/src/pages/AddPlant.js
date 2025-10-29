import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlantContext } from "../context/PlantContext";

function AddPlant() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const { plants, setPlants } = useContext(PlantContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a plant.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/plants",
        { name, description, image, category: "Flower" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new plant to context (so Dashboard & Home update instantly)
      setPlants([res.data, ...plants]);

      // Clear form
      setName("");
      setDescription("");
      setImage("");

      alert("🌸 Plant added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding plant:", err.response?.data || err.message);
      alert("Failed to add plant. Please try again.");
    }
  };

  return (
    <div className="add-plant-container">
      <h2>Add New Plant</h2>
      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Plant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <button type="submit">Add Plant</button>
      </form>
    </div>
  );
}

export default AddPlant;
