import { useContext, useState } from "react";
import { StudentContext } from "../context/StudentContext";
import "./style.css";

export default function StudentList() {
  const {
    students = [],
    attendance = {},
    deleteStudent,
    updateStudent,
  } = useContext(StudentContext);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    registerNumber: "",
    department: "",
  });

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.registerNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getPercentage = (student) => {
    const records = attendance?.[student._id] || {};
    const total = Object.keys(records).length;
    const present = Object.values(records).filter(
      (status) => status === "Present"
    ).length;

    return total === 0
      ? 0
      : ((present / total) * 100).toFixed(0);
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditData({
      name: student.name,
      registerNumber: student.registerNumber,
      department: student.department,
    });
  };

  const saveEdit = async () => {
    await updateStudent(editingId, editData);
    setEditingId(null);
  };

  return (
    <div className="page-container">
      <div className="table-card">
        <h2 className="page-title">Student List</h2>

        <input
          className="search-input"
          placeholder="Search by name or register no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Register No</th>
              <th>Department</th>
              <th>Attendance %</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => {
              const percentage = getPercentage(s);
              const isLow = Number(percentage) < 75;

              return (
                <tr
                  key={s._id}
                  className={isLow ? "low-attendance-row" : ""}
                >
                  <td>
                    {editingId === s._id ? (
                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      s.name
                    )}
                  </td>

                  <td>
                    {editingId === s._id ? (
                      <input
                        value={editData.registerNumber}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            registerNumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      s.registerNumber
                    )}
                  </td>

                  <td>
                    {editingId === s._id ? (
                      <input
                        value={editData.department}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            department: e.target.value,
                          })
                        }
                      />
                    ) : (
                      s.department
                    )}
                  </td>

                  <td>
                    {isLow ? (
                      <span className="warning-text">
                        ⚠ {percentage}%
                      </span>
                    ) : (
                      `${percentage}%`
                    )}
                  </td>

                  <td>
                    {editingId === s._id ? (
                      <button
                        className="save-btn"
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                    ) : (
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => startEdit(s)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteStudent(s._id)}
                        >
                          Delete
                        </button>
                      </div>
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