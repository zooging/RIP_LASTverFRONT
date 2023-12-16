import React from 'react';

const ListObjects = () => {
  // Получите список объектов из Local Storage
  const objects = JSON.parse(localStorage.getItem('objects')) || [];

  return (
    <div className="list-container">
      <h2>Список объектов</h2>
      {objects.length > 0 ? (
        objects.map((object) => (
          <div key={object.id} className="task-item">
            <span>ID: {object.id}</span>
            <span>Name: {object.name}</span>
          </div>
        ))
      ) : (
        <p>Нет сохраненных объектов</p>
      )}
    </div>
  );
};

export default ListObjects;
