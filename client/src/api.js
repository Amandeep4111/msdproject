import axios from "axios";

const API = axios.create({
  baseURL: "https://msd-95vk.onrender.com/api", // backend URL
});

export default API;
