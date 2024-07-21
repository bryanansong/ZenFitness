import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Feed from "./screens/Feed/Feed";
import History from "./screens/History/History";
import Dashboard from "./screens/Dashboard/Dashboard";
import Login from "./screens/auth/Login/Login";
import SignUp from "./screens/auth/SignUp/SignUp";
import Profile from "./screens/Profile/Profile";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const socket = io(import.meta.env.VITE_BACKEND_URL);

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        setIsAuthenticated(decodedToken.exp > currentTime);
        setUserId(decodedToken.userId);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      socket.emit("authenticate", userId);

      socket.on("notification", (notification) => {
        toast(notification.content, {
          type: "info",
          position: "top-right",
        });
      });
    }

    return () => {
      socket.off("notification");
    };
  }, [isAuthenticated, userId]);

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    return isAuthenticated ? (
      <div className="app">
        <ToastContainer />
        <SideBar />
        {children}
      </div>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
