import axios from "axios";

const api = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL
})

api.interceptors.request.use((config) => {
     const token = localStorage.getItem("access_token");

      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
        return config;
} , error => Promise.reject(error)
)

// 🛬 Response Interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.log('Unauthorized — redirect to login');
            // you can logout or redirect here
        }

        return Promise.reject(error);
    }
);


export default api