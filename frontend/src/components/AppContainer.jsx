import { Box, Center, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import EmployeeMenu from "./EmployeeMenu";

const AppContainer = () => {

    const { employee, isLoading } = useAuth();

    return isLoading ? (
        <Center w="100vw" h="90vh" flexDir="column">
          <Spinner mb={4} />
        </Center>
      ) : employee ? (
        <Box p={4} minH="100vh">
          <EmployeeMenu />
          <Outlet />
        </Box>
      ) : (
        <Navigate
          to="/login"
          replace
          state={{
            redirectUrl: window.location.pathname,
          }}
        />
      );
};

export default AppContainer;