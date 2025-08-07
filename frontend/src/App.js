import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  // Load all tasks
  const loadTasks = async () => {
    const res = await fetch("http://localhost:15000/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add new task
  const addTask = async () => {
    if (!text.trim()) return;
    await fetch("http://localhost:15000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, completed: false }),
    });
    setText("");
    loadTasks();
  };

  // Toggle task completed status
  const toggleTask = async (task) => {
    await fetch(`http://localhost:15000/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    loadTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:15000/tasks/${id}`, {method: "DELETE"});
    loadTasks();
  };

return (
  <div style={{ padding: 20 }}>
    <h1>To-Do App</h1>

    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Enter a task"
    />
    <button onClick={addTask}>Add</button>

    <ul>
      {tasks.map((task) => (
        <li key={task._id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task)}
          />
          {task.text}
          <button onClick={() => deleteTask(task._id)}>X</button>
        </li>
      ))}
    </ul>
  </div>
);
}

export default App;