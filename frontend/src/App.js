import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import MarkAttendance from "./pages/MarkAttendance";
import StudentList from "./pages/StudentList";
import Report from "./pages/Report";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>

      {/* Login Page */}
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
      />

      {/* Dashboard */}
      <Route
        path="/"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />

      {/* Protected Pages */}
      <Route
        path="/add"
        element={isLoggedIn ? <AddStudent /> : <Navigate to="/login" />}
      />

      <Route
        path="/mark"
        element={isLoggedIn ? <MarkAttendance /> : <Navigate to="/login" />}
      />

      <Route
        path="/students"
        element={isLoggedIn ? <StudentList /> : <Navigate to="/login" />}
      />

      <Route
        path="/report"
        element={isLoggedIn ? <Report /> : <Navigate to="/login" />}
      />

    </Routes>
  );
}

export default App;