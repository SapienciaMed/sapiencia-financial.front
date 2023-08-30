import axios, { AxiosInstance } from "axios";

export default function instanceApi(baseURL: string): AxiosInstance {
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: baseURL,
  });

  api.interceptors.request.use(
    (req) => {
      if (token !== null) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    },
    (err) => {
      throw err;
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      throw error;
    }
  );
  return api;
}
