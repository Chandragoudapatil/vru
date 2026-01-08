const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory "database"
let students = [];
let nextId = 1;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

// ---- API ROUTES ----

// Get all students
app.get('/api/students', (req, res) => {
  res.json(students);
});

// Create new student
app.post('/api/students', (req, res) => {
  const { name, email, department, semester, usn } = req.body;

  if (!name || !email || !department || !semester || !usn) {
    return res.status(400).json({ message: 'Please fill all fields.' });
  }

  const student = {
    id: nextId++,
    name,
    email,
    department,
    semester,
    usn
  };

  students.push(student);
  res.status(201).json(student);
});

// Update student
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email, department, semester, usn } = req.body;

  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  student.name = name ?? student.name;
  student.email = email ?? student.email;
  student.department = department ?? student.department;
  student.semester = semester ?? student.semester;
  student.usn = usn ?? student.usn;

  res.json(student);
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }
  students.splice(index, 1);
  res.status(204).send();
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Student registration app listening on http://localhost:${PORT}`);
});
