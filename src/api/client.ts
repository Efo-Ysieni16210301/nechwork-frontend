import axios from "axios";
import { auth } from "../firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});
api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// This is where a Firebase auth token will get attached automatically later:
// api.interceptors.request.use(async (config) => {
//   const token = await auth.currentUser?.getIdToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
