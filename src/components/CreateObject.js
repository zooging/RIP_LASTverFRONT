import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CreateObject = ({ onObjectCreate }) => {
  const [name, setName] = useState('');

  const handleCreate = () => {
    const newObject = {
      id: uuidv4(),
      name,
    };

    onObjectCreate(newObject);

    setName('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Название объекта"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreate}>Создать</button>
    </div>
  );
};

const ObjectList = ({ objects }) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {objects.map((object) => (
        <li key={object.id} style={{ marginBottom: '8px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
          {object.name}
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [objects, setObjects] = useState([]);

  const handleObjectCreate = (newObject) => {
    setObjects((prevObjects) => [...prevObjects, newObject]);
  };

  return (
    <div>
      <CreateObject onObjectCreate={handleObjectCreate} />
      <ObjectList objects={objects} />
    </div>
  );
};

export default App;
