const API_BASE = '/api/students';

const form = document.getElementById('student-form');
const message = document.getElementById('message');
const tbody = document.getElementById('students-table-body');

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = 'message';
  if (type) {
    message.classList.add(type);
  }
}

async function fetchStudents() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    renderStudents(data);
  } catch (err) {
    console.error(err);
    setMessage('Failed to load students.', 'error');
  }
}

function renderStudents(students) {
  tbody.innerHTML = '';
  if (!students.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
    cell.textContent = 'No students registered yet.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  students.forEach(student => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.usn}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.department}</td>
      <td>${student.semester}</td>
      <td>
        <button class="btn sm danger" data-id="${student.id}">Delete</button>
      </td>
    `;

    const deleteBtn = row.querySelector('button');
    deleteBtn.addEventListener('click', () => deleteStudent(student.id));

    tbody.appendChild(row);
  });
}

async function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    if (res.status === 204) {
      setMessage('Student deleted.', 'success');
      fetchStudents();
    } else {
      setMessage('Failed to delete student.', 'error');
    }
  } catch (err) {
    console.error(err);
    setMessage('Failed to delete student.', 'error');
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setMessage('');

  const student = {
    name: document.getElementById('name').value.trim(),
    usn: document.getElementById('usn').value.trim(),
    email: document.getElementById('email').value.trim(),
    department: document.getElementById('department').value,
    semester: document.getElementById('semester').value
  };

  if (!student.name || !student.usn || !student.email ||
      !student.department || !student.semester) {
    setMessage('Please fill all fields.', 'error');
    return;
  }

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message || 'Error adding student.', 'error');
      return;
    }

    form.reset();
    setMessage('Student added successfully!', 'success');
    fetchStudents();
  } catch (err) {
    console.error(err);
    setMessage('Failed to add student.', 'error');
  }
});

fetchStudents();
