import axios from "axios";

const API = axios.create({
  baseURL: "https://smarterp-1-6rfs.onrender.com",
});

export default API;