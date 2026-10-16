// In production, set VITE_API_URL in Vercel Dashboard → Settings → Environment Variables
// Example: https://your-backend.onrender.com/api
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
