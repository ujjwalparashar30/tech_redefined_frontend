import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"https://tech-redefined-http-server.onrender.com/",
  withCredentials: true,
});
