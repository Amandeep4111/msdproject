import React, { useContext, useEffect, useState } from "react";
import { PlantContext } from "../context/PlantContext";
import axios from "axios";

function Dashboard() {
  const { plants, setPlants, deletePlant } = useContext(PlantContext);
  const [userPlants, setUserPlants] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch user's plants
  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        const res = await axios.get("https://msdproject.onrender.com/api/plants/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPlants(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserPlants();
  }, [token, plants]); // refresh when plants state changes

  return (
    <div className="container">
      <h2>🛠 Dashboard - Your Plants</h2>
      {userPlants.length === 0 && <p>No plants added yet.</p>}
      <div className="grid">
        {userPlants.map((plant) => (
          <div className="card" key={plant._id}>
            <img src={plant.image} alt={plant.name} />
            <h4>{plant.name}</h4>
            <p>{plant.description}</p>
            <button className="delete-btn" onClick={() => deletePlant(plant._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
