import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AppContainer from "./components/AppContainer";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { setNavigate } from "./lib/navigation";
import { useEffect } from "react";
import queryClient from "./config/queryClient";
import { useMutation } from "@tanstack/react-query";
import { logout } from "./lib/api";
import Customers from "./pages/Customers";


function App() {
  const navigate = useNavigate();
  setNavigate(navigate);

  // Define signOut using useMutation
  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  });

  useEffect(() => {
    let inactivityTimer;

    // Call signOut instead of logoutUser
    const handleAutoLogout = () => {
      signOut();
    };

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleAutoLogout, 2 * 60 * 1000); // 2 minutes
    };

    // Listen for user activity to reset inactivity timer
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keypress", resetInactivityTimer);

    // Initialize the timer on mount
    resetInactivityTimer();

    // Clean up on unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keypress", resetInactivityTimer);
    };
  }, [signOut]);

  return <Routes>
    <Route path="/" element={<AppContainer />} >
      <Route index element={<Customers />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/email/verify/:code" element={<VerifyEmail />} />
    <Route path="/password/forgot" element={<ForgotPassword />} />
    <Route path="/password/reset" element={<ResetPassword />} />
  </Routes>
};

export default App;
