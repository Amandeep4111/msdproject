import React from "react";
import "./PlantCard.css";

const PlantCard = ({ plant }) => {
  return (
    <div className="plant-card">
      <img src={plant.imageUrl} alt={plant.name} />
      <h3>{plant.name}</h3>
      <p>{plant.category}</p>
    </div>
  );
};

export default PlantCard;
