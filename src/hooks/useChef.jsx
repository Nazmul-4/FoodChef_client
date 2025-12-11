import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure"; // Import the new hook

const useChef = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure(); // Use the hook

    const { data: isChef = false, isLoading: isChefLoading } = useQuery({
        queryKey: ['isChef', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            // Use axiosSecure instead of axios
            const res = await axiosSecure.get(`/users/chef/${user.email}`);
            return res.data.chef;
        }
    });

    return [isChef, isChefLoading];
};

export default useChef;