import { useContext, useState } from "react";
import { StudentContext } from "../context/StudentContext";
import "./style.css";

export default function MarkAttendance() {
  const { students = [], attendance = {}, setAttendance } =
    useContext(StudentContext);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleChange = (studentId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev?.[studentId] || {}),
        [selectedDate]: value,
      },
    }));
  };

  return (
    <div className="page-container">
      <div className="table-card">
        <h2 className="page-title">Mark Attendance</h2>

        <input
          type="date"
          className="date-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Register No</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.registerNumber}</td>
                <td>
                  <select
                    value={
                      attendance?.[s._id]?.[selectedDate] || ""
                    }
                    onChange={(e) =>
                      handleChange(s._id, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}