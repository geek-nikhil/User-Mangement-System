import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Hardcoded for this test
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for global error handling (optional but good practice)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally if needed (e.g., redirect to login)
        if (error.response && error.response.status === 401) {
            // Check if we are not already on login page to avoid loops
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
               // Maybe unauthorized, but let individual components handle redirects or
               // use AuthContext to logout. For pure API util, we just reject.
            }
        }
        return Promise.reject(error);
    }
);

export default api;
