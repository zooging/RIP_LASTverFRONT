import React, { useState, useEffect } from 'react';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/');
        const tasksData = await response.json();
        setTasks(tasksData);
      } catch (error) {
        console.error('Ошибка при загрузке задач', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Просмотр всех задач</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.isDone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTasks;
