import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://social-scheduler-backend-wl1i.onrender.com",
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api;
