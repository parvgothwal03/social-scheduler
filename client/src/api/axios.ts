import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://social-scheduler-backend-wl1i.onrender.com",
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

// Add a request interceptor to attach the Clerk token
api.interceptors.request.use(
  async (config) => {
    // Clerk attaches itself to the global window object in the browser
    const clerk = (window as Window & {
      Clerk?: {
        session?: {
          getToken: () => Promise<string | null>;
        };
      };
    }).Clerk;

    if (clerk?.session) {
      const token = await clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;