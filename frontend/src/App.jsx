import React , { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";

const App = () => {

  const { authUser , isCheckingAuth , checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser)
    return (
      <div className="flex item-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
      </Routes>

      <Toaster/>
    </div>
  );
};

export default App;
