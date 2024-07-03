import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Feed from "./screens/Feed/Feed";
import History from "./screens/History/History";
import Dashboard from "./screens/Dashboard/Dashboard";
import Login from "./screens/auth/Login/Login";
import SignUp from "./screens/auth/SignUp/SignUp";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  return <>{token ? children : <Navigate to="/login" replace />}</>;
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
              <div className="app">
                <SideBar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <div className="app">
                <SideBar />
                <Feed />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <div className="app">
                <SideBar />
                <History />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
