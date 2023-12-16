import { useState } from "react";


const ItemComponent = (props) => {
  const [item, setItem] = useState(props.data);
  const [isEdit, setIsEdit] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(item.title);

  const handleSave = () => {
    fetch(`http://localhost:3000`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.id,
        title: updatedTitle,
        isDone: item.isDone,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setItem(responseData);
        setIsEdit(false);
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setUpdatedTitle(item.title);
  };

  return (
    <div className="item">
      {isEdit ? (
        <div>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <button onClick={() => handleSave()}>Сохранить</button>
          <button onClick={() => handleCancel()}>Отмена</button>
        </div>
      ) : (
        <>
          <p>{item.title}</p>
          <div>
            <button onClick={() => handleEdit()}>Редактировать</button>
            <button onClick={() => props.onDelete()}>Удалить</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemComponent;
