import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Feed from "./screens/Feed/Feed";
import History from "./screens/History/History";
import Dashboard from "./screens/Dashboard/Dashboard";
import Login from "./screens/auth/Login/Login";
import SignUp from "./screens/auth/SignUp/SignUp";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Profile from "./screens/Profile/Profile";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(true);

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          setIsTokenValid(decodedToken.exp > currentTime);
        } catch (error) {
          console.error("Invalid token: ", error);
          setIsTokenValid(false);
        }
      } else {
        setIsTokenValid(false);
      }
    };

    checkTokenValidity();

    const interval = setInterval(checkTokenValidity, 10000);
    return () => clearInterval(interval);
  }, []);

  return isTokenValid ? (
    <div className="app">
      <SideBar />
      {children}
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
