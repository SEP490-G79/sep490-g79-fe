import axios from "axios";
import { toast } from "react-toastify";

const authorizedAxiosInstance = axios.create({
  baseURL: "http://localhost:9999/api",
  timeout: 1000 * 60 * 10,
  withCredentials: true,
});
authorizedAxiosInstance.interceptors.request.use(
  function (config: any) {
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

authorizedAxiosInstance.interceptors.response.use(
  function (response: any) {
    return response;
  },
  function (error: any) {
    if (error.response?.status === 401) {
      authorizedAxiosInstance.delete("/auth/logout", {
        withCredentials: true,
      });
      location.href = "/login";
    }

    const originalRequest = error.config;
    console.log("originalRequest: ", originalRequest);
    if (
      error.response &&
      error.response.status === 410 &&
      originalRequest._retry
    ) {
      originalRequest._retry = true;
    }
    if (error.response && error.response.status !== 410) {
      toast.error(error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
