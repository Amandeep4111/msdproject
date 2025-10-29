import React, { useEffect, useState } from "react";
import API from "../api";

const Plants = () => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await API.get("/plants");
        setPlants(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlants();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Plants</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {plants.map(plant => (
          <div key={plant._id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <img src={plant.imageUrl} alt={plant.name} style={{ width: "100%" }}/>
            <h3>{plant.name}</h3>
            <p>{plant.category}</p>
            <p>{plant.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plants;
