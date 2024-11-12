import { useQuery } from "@tanstack/react-query";
import { getEmployee } from "../lib/api";


export const AUTH = "auth";

const useAuth = (opts = {}) => {
    const {
        data: employee,
        ...rest
    } = useQuery({
        queryKey: [AUTH],
        queryFn: getEmployee,
        staleTime: Infinity,
        ...opts
    });
    return {
        employee, ...rest
    };
};

export default useAuth;