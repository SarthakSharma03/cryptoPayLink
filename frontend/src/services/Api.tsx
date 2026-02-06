import axios from 'axios';

const API_BASE_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,

});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorMessage = "Something went wrong";
    if (error.response) {
     
      const data = error.response.data;
      errorMessage = data.error || data.message || errorMessage;
    } else if (error.request) {
     
      errorMessage = "No response from server";
    } else {
          errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);
