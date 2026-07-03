import { useContext, useState } from "react";
import { StudentContext } from "../context/StudentContext";
import "./style.css";

export default function AddStudent() {
  const { students, addStudent, deleteStudent } =
    useContext(StudentContext);

  const [name, setName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [department, setDepartment] = useState("");

  const handleAdd = async () => {
    if (!name.trim() || !registerNumber.trim() || !department.trim()) {
      return;
    }

    await addStudent({
      name: name.trim(),
      registerNumber: registerNumber.trim(),
      department: department.trim(),
    });

    // clear fields after successful add
    setName("");
    setRegisterNumber("");
    setDepartment("");
  };

  return (
    <div className="page-container">
      {/* Add Card */}
      <div className="form-card">
        <h2 className="page-title">Add Student</h2>

        <div className="form-grid">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Register Number"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
          />

          <input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <button onClick={handleAdd}>
            Add Student
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="table-card">
        <h2 className="page-title">Student List</h2>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Register No</th>
              <th>Department</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.registerNumber}</td>
                  <td>{s.department}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteStudent(s._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}