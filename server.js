const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
// Parse JSON request bodies
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- In-memory data store ----------
let students = [
  { id: 1, name: "Aarav Sharma", department: "Information Science", semester: 3 },
  { id: 2, name: "Diya Nair", department: "Computer Science", semester: 5 },
  { id: 3, name: "Rohan Shetty", department: "Information Science", semester: 1 },
];
let nextId = 4;

// ---------- Helpers ----------
function validateStudent(body) {
  const errors = [];
  const { name, department, semester } = body || {};

  if (typeof name !== "string" || name.trim() === "") {
    errors.push("name is required and must be a non-empty string");
  }
  if (typeof department !== "string" || department.trim() === "") {
    errors.push("department is required and must be a non-empty string");
  }
  if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
    errors.push("semester is required and must be an integer between 1 and 8");
  }
  return errors;
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ---------- Routes ----------
const router = express.Router();

// GET /students  (optional filter: /students?department=Information Science)
router.get("/", (req, res) => {
  const { department } = req.query;
  let result = students;

  if (department) {
    result = students.filter(
      (s) => s.department.toLowerCase() === String(department).trim().toLowerCase()
    );
  }

  res.status(200).json({ count: result.length, students: result });
});

// GET /students/:id
router.get("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student ID must be a positive integer" });
  }

  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: `Student with ID ${id} not found` });
  }

  res.status(200).json(student);
});

// POST /students
router.post("/", (req, res) => {
  const errors = validateStudent(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const { name, department, semester } = req.body;
  const newStudent = {
    id: nextId++,
    name: name.trim(),
    department: department.trim(),
    semester,
  };
  students.push(newStudent);

  res.status(201).json({ message: "Student added successfully", student: newStudent });
});

// PUT /students/:id
router.put("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student ID must be a positive integer" });
  }

  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: `Student with ID ${id} not found` });
  }

  const errors = validateStudent(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const { name, department, semester } = req.body;
  student.name = name.trim();
  student.department = department.trim();
  student.semester = semester;

  res.status(200).json({ message: "Student updated successfully", student });
});

// DELETE /students/:id
router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student ID must be a positive integer" });
  }

  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Student with ID ${id} not found` });
  }

  const [deleted] = students.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully", student: deleted });
});

app.use("/students", router);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Student Management API is running", endpoint: "/students" });
});

// ---------- Error handling ----------
// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Centralized error handler (also catches malformed JSON bodies)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
