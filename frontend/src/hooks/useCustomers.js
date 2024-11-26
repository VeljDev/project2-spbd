import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../lib/api";


export const CUSTOMERS = "customers";

const useCustomers = (opts = {}) => {
    const {
        data: customers,
        ...rest
    } = useQuery({
        queryKey: [CUSTOMERS],
        queryFn: getCustomers,
        staleTime: Infinity,
        ...opts
    });
    return {
        customers, ...rest
    };
};

export default useCustomers;