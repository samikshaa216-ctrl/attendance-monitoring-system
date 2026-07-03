import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { StudentContext } from "../context/StudentContext";
import "./style.css";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const { students = [], attendance = {} } =
    useContext(StudentContext);

  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const totalStudents = students.length;

  const presentToday = students.filter(
    (s) => attendance?.[s._id]?.[today] === "Present"
  ).length;

  const lowAttendanceCount = students.filter((s) => {
    const records = attendance?.[s._id] || {};
    const totalDays = Object.keys(records).length;

    const presentDays = Object.values(records).filter(
      (status) => status === "Present"
    ).length;

    const percentage =
      totalDays === 0 ? 0 : (presentDays / totalDays) * 100;

    return percentage < 75;
  }).length;

  const totalAttendanceEntries = students.reduce((sum, s) => {
    const records = attendance?.[s._id] || {};
    return sum + Object.keys(records).length;
  }, 0);

  const totalPresentEntries = students.reduce((sum, s) => {
    const records = attendance?.[s._id] || {};

    return (
      sum +
      Object.values(records).filter(
        (status) => status === "Present"
      ).length
    );
  }, 0);

  const overallPercentage =
    totalAttendanceEntries === 0
      ? 0
      : (
          (totalPresentEntries / totalAttendanceEntries) *
          100
        ).toFixed(1);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="logo">AMS</h2>

        <nav className="nav-links">
          <Link to="/add">Add Student</Link>
          <Link to="/mark">Mark Attendance</Link>
          <Link to="/students">Student List</Link>
          <Link to="/report">Reports</Link>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <h1 className="dashboard-title">
          Attendance Monitoring Dashboard
        </h1>

        <div className="stats-grid">
          <div className="stat-card blue">
            <h3>Total Students</h3>
            <p>{totalStudents}</p>
          </div>

          <div className="stat-card green">
            <h3>Present Today</h3>
            <p>{presentToday}</p>
          </div>

          <div className="stat-card red">
            <h3>Low Attendance</h3>
            <p>{lowAttendanceCount}</p>
          </div>

          <div className="stat-card purple">
            <h3>Overall %</h3>
            <p>{overallPercentage}%</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Report Analysis</h3>

          <p>
            Best Performing Class Attendance:
            <strong> {overallPercentage}%</strong>
          </p>

          <p>
            Students at Risk:
            <strong> {lowAttendanceCount}</strong>
          </p>

          <p>
            Today's Trend:
            <strong>
              {" "}
              {presentToday > totalStudents / 2
                ? "Healthy attendance"
                : "Low attendance today"}
            </strong>
          </p>

          <p>
            Suggestion:
            <strong>
              {" "}
              {lowAttendanceCount > 0
                ? "Follow up with shortage students"
                : "Attendance is stable"}
            </strong>
          </p>
        </div>
      </main>
    </div>
  );
}