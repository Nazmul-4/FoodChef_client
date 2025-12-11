import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const axiosSecure = axios.create({
    baseURL: 'https://food-chef-server-three.vercel.app'
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useContext(AuthContext);

    // 1. Intercept Request: Add Token
    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token');
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    // 2. Intercept Response: Handle 401/403 Errors
    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response?.status;
        
        // If error is 401 (Unauthorized) or 403 (Forbidden), log the user out
        if (status === 401 || status === 403) {
            await logOut();
            navigate('/login');
        }
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosSecure;