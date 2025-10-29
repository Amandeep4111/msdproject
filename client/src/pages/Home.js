import React, { useContext } from "react";
import { PlantContext } from "../context/PlantContext";

function Home() {
  const { plants } = useContext(PlantContext);

  return (
    <div className="container">
      <h2>🌸 Home - All Flowers</h2>
      <div className="grid">
        {plants.map((plant) => (
          <div className="card" key={plant._id}>
            <img src={plant.image} alt={plant.name} />
            <h4>{plant.name}</h4>
            <p>{plant.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
