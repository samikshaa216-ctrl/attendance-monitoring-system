const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ CONNECT ATLAS
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) =>
    console.log("DB Connection Error:", err)
  );

// ✅ SCHEMA
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

// ✅ GET
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ✅ POST
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ✅ PUT (THIS FIXES EDIT SAVE)
app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent =
      await Student.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          registerNumber: req.body.registerNumber,
          department: req.body.department,
        },
        { new: true }
      );

    res.json(updatedStudent);
  } catch (err) {
    console.log("PUT error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ✅ DELETE
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({
      message: "Student deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(5000, () =>
  console.log("Server running on port 5000 🚀")
);