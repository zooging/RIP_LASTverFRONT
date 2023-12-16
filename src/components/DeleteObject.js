import React, { useState } from 'react';

const DeleteObject = () => {
  const [id, setId] = useState(''); 

  const handleDelete = () => {
    const objects = JSON.parse(localStorage.getItem('objects')) || [];

    const updatedObjects = objects.filter(obj => obj.id !== id);

    localStorage.setItem('objects', JSON.stringify(updatedObjects));

    setId('');
  };

  return (
    <div className="object-form">
      <h2>Удалить объект</h2>
      <input
        type="text"
        placeholder="Идентификатор объекта для удаления"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
};

export default DeleteObject;
