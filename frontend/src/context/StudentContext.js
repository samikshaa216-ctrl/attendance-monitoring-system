import { createContext, useEffect, useState } from "react";

export const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

 const API = "https://attendance-monitoring-system-production.up.railway.app/students";

  // ✅ FETCH STUDENTS FROM ATLAS
  const fetchStudents = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Fetch error:", err);
      setStudents([]);
    }
  };

  // ✅ ADD STUDENT
  const addStudent = async (student) => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      if (res.ok) {
        await fetchStudents();
      } else {
        console.error("Failed to add student:", res.statusText);
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // ✅ DELETE STUDENT
  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchStudents();

        // remove attendance also
        setAttendance((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ UPDATE STUDENT (REMOVED DUPLICATE)
  const updateStudent = async (id, updatedStudent) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      });

      if (res.ok) {
        await fetchStudents();
      } else {
        console.error("Failed to update student:", res.statusText);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ✅ SAFE ATTENDANCE UPDATE
  const markAttendance = (studentId, status, date) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev?.[studentId] || {}),
        [date]: status,
      },
    }));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <StudentContext.Provider
      value={{
        students,
        attendance,
        setAttendance,
        addStudent,
        deleteStudent,
        updateStudent,
        fetchStudents,
        markAttendance,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}