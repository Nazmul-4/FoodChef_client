import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure"; // Import the new hook

const useAdmin = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure(); // Use the hook

    const { data: isAdmin = false, isLoading: isAdminLoading } = useQuery({
        queryKey: ['isAdmin', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            // Use axiosSecure instead of axios
            const res = await axiosSecure.get(`/users/admin/${user.email}`);
            return res.data.admin;
        }
    });

    return [isAdmin, isAdminLoading];
};

export default useAdmin;