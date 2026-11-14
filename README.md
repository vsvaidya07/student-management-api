# Student Management REST API

A simple REST API built with **Node.js** and **Express.js** to manage student records. Data is stored in an in-memory array (resets when the server restarts).

## Features

- Full CRUD for students (ID, Name, Department, Semester)
- Express Router for clean routing
- JSON body parsing middleware
- Input validation (missing or invalid fields return `400`)
- Proper HTTP status codes: `200`, `201`, `400`, `404`, `500`
- Error-handling middleware (including malformed JSON)
- Search/filter students by department

## Setup

```bash
npm install
npm start
```

Server runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint                          | Description                  |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/students`                       | Get all students             |
| GET    | `/students?department=<name>`     | Filter students by department |
| GET    | `/students/:id`                   | Get a student by ID          |
| POST   | `/students`                       | Add a new student            |
| PUT    | `/students/:id`                   | Update a student             |
| DELETE | `/students/:id`                   | Delete a student             |

### Student object

```json
{
  "id": 1,
  "name": "Aarav Sharma",
  "department": "Information Science",
  "semester": 3
}
```

### Example: POST /students

Request body:

```json
{
  "name": "Meera Rao",
  "department": "Information Science",
  "semester": 4
}
```

Response `201 Created`:

```json
{
  "message": "Student added successfully",
  "student": {
    "id": 4,
    "name": "Meera Rao",
    "department": "Information Science",
    "semester": 4
  }
}
```

### Validation rules

- `name`: required, non-empty string
- `department`: required, non-empty string
- `semester`: required, integer between 1 and 8

### Status codes

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| 200  | Request successful                       |
| 201  | Student created                          |
| 400  | Invalid input, invalid ID or bad JSON    |
| 404  | Student or route not found               |
| 500  | Unexpected server error                  |

## Testing

All endpoints were tested using Postman / Thunder Client. Add your screenshots here:

- `screenshots/get-all.png`
- `screenshots/post.png`

## Tech Stack

Node.js, Express.js
