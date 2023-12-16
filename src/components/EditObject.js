import React, { useState } from 'react';

const EditObject = () => {
  const [id, setId] = useState(''); 
  const [name, setName] = useState(''); 

  const handleEdit = () => {
    const objects = JSON.parse(localStorage.getItem('objects')) || [];

    
    const objectIndex = objects.findIndex(obj => obj.id === id);

    if (objectIndex !== -1) {
  
      objects[objectIndex].name = name;

      localStorage.setItem('objects', JSON.stringify(objects));

      setId('');
      setName('');
    }
  };

  return (
    <div className="object-form">
      <h2>Редактировать объект</h2>
      <input
        type="text"
        placeholder="Идентификатор объекта для редактирования"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Новое имя объекта"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleEdit}>Редактировать</button>
    </div>
  );
};

export default EditObject;
