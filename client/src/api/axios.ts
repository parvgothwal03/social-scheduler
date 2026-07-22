import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://social-scheduler-backend-wl1i.onrender.com"
});

export default api;
