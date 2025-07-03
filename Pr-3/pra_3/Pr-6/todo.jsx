import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Todo = ({ task, onDelete, onEdit }) => {
  return (
    <div className="task">
      <span>{task}</span>
      <div className="icons">
        <FaEdit className="icon edit" onClick={onEdit} />
        <FaTrash className="icon delete" onClick={onDelete} />
      </div>
    </div>
  );
};

export default Todo;
