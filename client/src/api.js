import axios from "axios";

const API = axios.create({
  baseURL: "https://msdproject.onrender.com/api", // backend URL
});

export default API;
