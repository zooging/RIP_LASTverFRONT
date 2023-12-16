import { useState, useEffect } from "react";

const CreateComponent = (props) => {
  const [content, setContent] = useState(props.data ? props.data.content : "");
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    setIsNew(props.data ? false : true);
  }, [props.data]);

  return (
    <div className={`form ${isNew ? "new-object" : ""}`} style={props.style}>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Введите текст"
      />
      <div>
        {props.data && <button onClick={() => props.onCancel()}>Отмена</button>}
        <button onClick={() => props.onSave(content)}>{props.buttonText || "Добавить"}</button>
      </div>
    </div>
  );
};

export default CreateComponent;