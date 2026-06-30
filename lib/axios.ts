import axios from "axios";

const axiosInstance = axios.create({
baseURL: process.env.NEXT_PUBLIC_APP_URL,
  headers: {
    "Content-Type": "application/json",
  },
  //  withCredentials: true, 

  // Public API
// const publicApi = axios.create({
//   baseURL: API_URL,
// })

// // Admin API
// const adminApi = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// })
});

export default axiosInstance;