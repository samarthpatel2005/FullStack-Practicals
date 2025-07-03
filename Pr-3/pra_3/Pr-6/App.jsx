import React, { useState } from "react";
import Todo from "./Todo";
import "./index.css";

const App = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTask = () => {
    if (task.trim() !== "") {
      setTodos([...todos, { text: task }]);
      setTask("");
    }
  };

  const deleteTask = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const editTask = (index) => {
    const newTask = prompt("Edit your task", todos[index].text);
    if (newTask) {
      const updatedTodos = [...todos];
      updatedTodos[index].text = newTask;
      setTodos(updatedTodos);
    }
  };

  return (
    <div className="container">
      <h1>Get Things Done !</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="What is the task today?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {todos.map((todo, index) => (
        <Todo
          key={index}
          task={todo.text}
          onDelete={() => deleteTask(index)}
          onEdit={() => editTask(index)}
        />
      ))}
    </div>
  );
};

export default App;
