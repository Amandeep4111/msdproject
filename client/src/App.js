import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddPlant from "./pages/AddPlant";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { PlantProvider } from "./context/PlantContext";

function App() {
  return (
    <PlantProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-plant" element={<AddPlant />} />
        </Routes>
      </Router>
    </PlantProvider>
  );
}

export default App;
