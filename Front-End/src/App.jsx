import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Tests from "./Components/pages/Tests/Tests";
import Home from "./Components/pages/Home/Home";
import Psychiatrists from "./Components/pages/Psychiatrists/Psychiatrists";
import Resources from "./Components/pages/Resources/Resources";
import Navbar from "./Components/layout/NavBar/Navbar";
import Login from "./Components/Api/Auth/Login";
import Register from "./Components/Api/Auth/Register";
import VerifyEmail from "./Components/Api/Auth/VerifyEmail";
import Profile from "./Components/pages/profile/profile";
import DataUsers from "./Components/Api/Auth/Data-users";
import Psy_Profile from "./Components/pages/Psychiatrists/Psy_Profile";
import Community from "./Components/pages/Community/Community";
import AdminDashboard from "./Components/Api/Dashboard/AdminDashboard";
import Test_page from "./Components/pages/Tests/components/Test_page";
import ScrollToTop from "./ScrollToTop";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <>
     <ScrollToTop />
      {isAuthenticated && <Navbar />}
      <Routes>
       
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/register"
          element={<Register setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/verify"
          element={<VerifyEmail setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/data-user"
          element={<DataUsers setIsAuthenticated={setIsAuthenticated} />}
        />
        
        <Route
          path="/profile"
          element={<Profile setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/dashboard"
          element={<AdminDashboard setIsAuthenticated={setIsAuthenticated} />}
        />
                <Route
          path="/tests/:id"
          element={<Test_page setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route path="/" element={<Home />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Resources /> : <Navigate to="/" />}
        />
        <Route
          path="/resources/:id"
          element={
            isAuthenticated ? <Resources /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/community"
          element={
            isAuthenticated ? <Community /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/psychiatrists"
          element={
            isAuthenticated ? (
              <Psychiatrists />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/psychiatrists/:id" element={<Psy_Profile />} />
        <Route
          path="/tests"
          element={
            isAuthenticated ? <Tests /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
