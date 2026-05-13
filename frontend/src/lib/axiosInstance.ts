import axios from "axios";

interface ClerkWindow {
  session?: {
    getToken?: () => Promise<string | null>;
  };
}

declare global {
  interface Window {
    Clerk?: ClerkWindow;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await window.Clerk?.session?.getToken?.();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);