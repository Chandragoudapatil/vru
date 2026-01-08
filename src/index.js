require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/student');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined. Please explicitly set it in your environment configuration (e.g., Render Dashboard).');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to DB before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Student registration app listening on http://localhost:${PORT}`);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

// ---- API ROUTES ----

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new student
app.post('/api/students', async (req, res) => {
  const { name, email, department, semester, usn } = req.body;

  if (!name || !email || !department || !semester || !usn) {
    return res.status(400).json({ message: 'Please fill all fields.' });
  }

  try {
    const student = new Student({
      name,
      email,
      department,
      semester,
      usn
    });
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, department, semester, usn } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (department) student.department = department;
    if (semester) student.semester = semester;
    if (usn) student.usn = usn;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// app.listen moved inside connectDB promise

