import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import Auth from "./components/Auth/Auth"

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import React,{ useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Header from "../src/components/Layout/Header.jsx"
import Footer from "./components/Layout/Footer.jsx";
import Home from "./components/Home/Home.jsx"
import PostUpload from "./components/Post/PostUpload.jsx";
import PostView from "./components/Post/PostView.jsx"
import UserProfile from "./components/UserProfilePage/UserProfilePage.jsx";
import Trends from "./components/Trends/Trends.jsx";
import Collaboration from "./components/Collaboration/Collaboration.jsx";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme} style={{overflow : "hidden"}}  >
      <Header />

      <div style={{
    position: "relative",
    zIndex: 0,
    paddingTop: "64px",
    overflowY: "scroll",
    height: "100vh",
    maxWidth: "100vw",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE and Edge
    marginTop:"11rem"
    }}>
      <Routes>

        <Route path="/" element={ <Home />} />
        <Route path="/post/upload" element={authUser ? <PostUpload /> : <Navigate to="/login" />} />
        <Route path="/post/:id" element={authUser ? <PostView /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <Auth /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Auth /> : <Navigate to="/" />} />
        <Route path="/chat/settings" element={<SettingsPage />} />
        <Route path="/profile/:id" element={authUser ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/collaboration" element={authUser ? <Collaboration /> : <Navigate to="/login" />} />
        <Route path="/trends" element={<Trends /> } />
      </Routes>

      <Footer />
      </div>

      
    </div>
  );
};
export default App;
