import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showRegister, setShowRegister] = useState(false);

  // Keep dark mode in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  //Fetch tasks from backend on load (with JWT)
  useEffect(() => {
    const token = localStorage.getItem("token"); // get JWT token
    if (!token) return;

    fetch("https://todo-backend-b03m.onrender.com/api/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include token
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [token]);


  //Conditional rendering for regsiter

  if (!token) {
  return showRegister ? (
    <div>
      <Register setToken={setToken} />
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have an account?{" "}
        <button onClick={() => setShowRegister(false)}>Login</button>
      </p>
    </div>
  ) : (
    <div>
      <Login setToken={setToken} />
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don't have an account?{" "}
        <button onClick={() => setShowRegister(true)}>Register</button>
      </p>
    </div>
  );
}
  
  //Add new task to backend (with JWT)
  const handleAddTask = () => {
    if (newTask.trim() === "") return;

    const token = localStorage.getItem("token"); // get JWT token
    if (!token) return;

    fetch("https://todo-backend-b03m.onrender.com/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include token
      },
      body: JSON.stringify({ task: newTask }),
    })
      .then((res) => res.json())
      .then((savedTask) => {
        setTasks([...tasks, savedTask]);
        setNewTask("");
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  //Delete task from backend (with JWT)
  const handleDeleteTask = (id) => {
    const token = localStorage.getItem("token"); // get JWT token
    if (!token) return;

    fetch(`https://todo-backend-b03m.onrender.com/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include token
      },
    })
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  //Clear all tasks from backend (with JWT)
  const handleClearAll = () => {
    const token = localStorage.getItem("token"); // get JWT token
    if (!token) return;

    fetch("https://todo-backend-b03m.onrender.com/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include token
      },
    })
      .then(() => setTasks([]))
      .catch((err) => console.error("Error clearing all tasks:", err));
  };

  //Toggle completion in backend (with JWT)
  const handleToggleCompleted = (id, currentStatus) => {
    const token = localStorage.getItem("token"); // get JWT token
    if (!token) return;

    fetch(`https://todo-backend-b03m.onrender.com/api/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include token
      },
      body: JSON.stringify({ completed: !currentStatus }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: darkMode ? "#121212" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow py-3">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 fs-3">📝 My To-Do App</span>
          <div className="ms-auto d-flex align-items-center text-white">
            {/* Dark Mode Switch */}
            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="darkModeSwitch"
                onChange={toggleDarkMode}
                checked={darkMode}
              />
              <label className="form-check-label" htmlFor="darkModeSwitch">
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </label>
            </div>

            {/* Logout Button */}
            <button
              className="btn btn-outline-light"
              onClick={() => {
                localStorage.removeItem("token"); // remove JWT token
                setToken(""); // update state to show login page
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <br />
      <br />

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <button
        onClick={handleClearAll}
        style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
      >
        Clear All
      </button>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleCompleted(task._id, task.completed)}
              />
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  marginLeft: "10px",
                }}
              >
                {task.task}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTask(task._id)}
              style={{
                color: "red",
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <strong>📝 Total:</strong> {totalTasks} &nbsp;|&nbsp;
        <strong>✅ Completed:</strong> {completedTasks} &nbsp;|&nbsp;
        <strong>⏳ Pending:</strong> {pendingTasks}
      </div>
    </div>
  );
}

export default App;
