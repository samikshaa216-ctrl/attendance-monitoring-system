import { useContext, useState } from "react";
import { StudentContext } from "../context/StudentContext";
import "./style.css";

export default function Report() {
  const { students = [], attendance = {} } =
    useContext(StudentContext);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const getAttendanceData = (student) => {
    const records = attendance?.[student._id] || {};
    const dates = Object.keys(records);

    const totalDays = dates.length;
    const presentDays = Object.values(records).filter(
      (status) => status === "Present"
    ).length;

    const percentage =
      totalDays === 0
        ? 0
        : ((presentDays / totalDays) * 100).toFixed(0);

    const last5 = dates.slice(-5).reverse();

    const currentMonth = new Date().getMonth();
    const monthlyRecords = dates.filter(
      (date) => new Date(date).getMonth() === currentMonth
    );

    const monthlyPresent = monthlyRecords.filter(
      (date) => records[date] === "Present"
    ).length;

    return {
      percentage,
      last5,
      records,
      monthlyPresent,
      monthlyTotal: monthlyRecords.length,
    };
  };

  return (
    <div className="page-container">
      <div className="table-card">
        <h2 className="page-title">Attendance Report</h2>

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
              <th>Attendance %</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => {
              const data = getAttendanceData(s);
              const isLow = Number(data.percentage) < 75;

              return (
                <tr
                  key={s._id}
                  className={isLow ? "low-attendance-row" : ""}
                >
                  <td
                    className="student-name-hover"
                    onMouseEnter={() => setHoveredStudent(s)}
                    onMouseLeave={() => setHoveredStudent(null)}
                    onMouseMove={(e) =>
                      setMousePosition({
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                  >
                    {s.name}

                    {hoveredStudent?._id === s._id && (
                      <div
                        className="floating-hover"
                        style={{
                          top: mousePosition.y - 180,
                          left: mousePosition.x + 20,
                        }}
                      >
                        <h4>{s.name}</h4>
                        <p>ID: {s.registerNumber}</p>
                        <p>Dept: {s.department}</p>
                        <p>{data.percentage}%</p>

                        <div className="hover-section">
                          <strong>Last 5 Records</strong>
                          {data.last5.length > 0 ? (
                            data.last5.map((date) => (
                              <p key={date}>
                                {date} → {data.records[date]}
                              </p>
                            ))
                          ) : (
                            <p>No records yet</p>
                          )}
                        </div>

                        <p>{isLow ? "Shortage" : "Safe"}</p>
                        <p>
                          Month: {data.monthlyPresent}/
                          {data.monthlyTotal}
                        </p>
                      </div>
                    )}
                  </td>

                  <td>{s.registerNumber}</td>

                  <td>
                    {attendance?.[s._id]?.[selectedDate] ||
                      "Not Marked"}
                  </td>

                  <td>
                    {isLow ? (
                      <span className="warning-text">
                        ⚠ {data.percentage}%
                      </span>
                    ) : (
                      `${data.percentage}%`
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}