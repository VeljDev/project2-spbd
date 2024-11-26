import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";
import queryClient from "../config/queryClient";
import { useMutation } from "@tanstack/react-query";


const EmployeeMenu = () => {

    const navigate = useNavigate();

    const { mutate: signOut } = useMutation({
        mutationFn: logout,
        onSettled: () => {
            queryClient.clear();
            navigate("/login", { replace: true });
        }
    });

  return (
    <Menu isLazy placement="right-start">
        <MenuButton position="absolute" left="1.5rem" bottom="1.5rem">
            <Avatar src="#" />
        </MenuButton>
        <MenuList>
            <MenuItem onClick={() => navigate("/")}>Customers</MenuItem>
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
            <MenuItem onClick={signOut}>Logout</MenuItem>
        </MenuList>
    </Menu>
  )
};

export default EmployeeMenu;