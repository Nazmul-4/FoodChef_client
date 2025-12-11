import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const useChef = () => {
    const { user, loading } = useContext(AuthContext);
    
    const { data: isChef = false, isLoading: isChefLoading } = useQuery({
        queryKey: ['isChef', user?.email],
        enabled: !loading && !!user?.email, // Only query if user is logged in
        queryFn: async () => {
            // Using axios is safer than fetch here
            const res = await axios.get(`https://food-chef-server-three.vercel.app/users/chef/${user.email}`);
            return res.data.chef; // The server returns { chef: true/false }
        }
    });

    return [isChef, isChefLoading];
};

export default useChef;