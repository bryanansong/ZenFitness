import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Feed from "./screens/Feed/Feed";
import History from "./screens/History/History";
import Dashboard from "./screens/Dashboard/Dashboard";
import Login from "./screens/auth/Login/Login";
import SignUp from "./screens/auth/SignUp/SignUp";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <div className="app">
              <SideBar />
              <Dashboard />
            </div>
          }
        />
        <Route
          path="/feed"
          element={
            <div className="app">
              <SideBar />
              <Feed />
            </div>
          }
        />
        <Route
          path="/history"
          element={
            <div className="app">
              <SideBar />
              <History />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
