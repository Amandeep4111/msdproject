import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const [plants, setPlants] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch all plants for home on load
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await axios.get("https://msdproject.onrender.com/api/plants");
        setPlants(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlants();
  }, []);

  // Delete plant function
  const deletePlant = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/plants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from shared state
      setPlants(plants.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <PlantContext.Provider value={{ plants, setPlants, deletePlant }}>
      {children}
    </PlantContext.Provider>
  );
};
