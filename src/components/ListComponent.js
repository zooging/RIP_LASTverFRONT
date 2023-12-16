import { useEffect, useState } from "react";
import CreateComponent from "./CreateComponent";
import ItemComponent from "./ItemComponent";
import ViewTasks from "./ViewTasks";
import io from "socket.io-client";

const ListComponent = (props) => {
  const [list, setList] = useState([]);
  const [showTasks, setShowTasks] = useState(false);
  const [socket, setSocket] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const [loginStatus, setLoginStatus] = useState(false);
  const [authStep, setAuthStep] = useState('registration');
  const [initialStep, setInitialStep] = useState(true);
  const [currentTab, setCurrentTab] = useState('login');
  

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "value",
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchTasks = () => {
    fetch("http://localhost:3000")
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setList(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setList(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSave = (content) => {
    if (content.trim() === "") {
      console.error("Ошибка при сохранении данных: содержимое пусто");
      return;
    }
  
    fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: content }),
    })
      .then((response) => response.json())
      .then(() => {
        // Обновляем список, используя форму функции обратного вызова для setList
        setList((prevList) => {
          const newList = [...prevList]; // Создаем новый массив, чтобы избежать прямого изменения состояния
          // Запрашиваем обновленный список снова
          fetch("http://localhost:3000")
            .then((response) => response.json())
            .then((responseData) => {
              if (Array.isArray(responseData)) {
                // Обновляем список с последними данными
                return [...responseData];
              } else {
                console.error("Недопустимый формат ответа:", responseData);
                return prevList; // Возвращаем предыдущий список, если ответ недействителен
              }
            })
            .then((updatedList) => {
              setList(updatedList); // Устанавливаем состояние с обновленным списком
            });
          return newList; // Мгновенно возвращаем предыдущий список для обновления интерфейса
        });
      });
  };
  
  

  const handleDelete = (key) => {
    fetch(`http://localhost:3000/?id=${list[key].id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          let arr = Array.from(list);
          arr.splice(key, 1);
          setList(arr);
        } else {
          console.error("Failed to delete:", response.status, response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const handleRegisterClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        setRegistrationComplete(true);
        setLoginStatus(true);
        setCurrentTab('createTask'); // Set the currentTab to 'createTask' after successful registration
      } else {
        console.error('Registration failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
  
  

  const handleLoginClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setLoginStatus(true);
      } else {
        console.error('Login failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = () => {
    props.setUserLoggedIn(false);
    setLoginStatus(false);
  };


  useEffect(() => {
    if (loginStatus || registrationComplete) {
      fetchTasks();
    }
  }, [loginStatus, registrationComplete]);

  if (!props.userLoggedIn) {
    return (
      <div className="list-container">
        {registrationComplete ? (
          <>
            <h3>Добавить новую задачу</h3>
            <CreateComponent onSave={(content) => handleSave(content)} className="task-input" />

            <button onClick={() => setShowTasks(!showTasks)}>
              {showTasks ? "Скрыть задачи" : "Показать все задачи"}
            </button>

            {showTasks && <ViewTasks />}

            {list &&
              list.map((item, key) => {
                if (!item) return null;
                return <ItemComponent key={item.id} data={item} onDelete={() => handleDelete(key)} />;
              })}
          </>
        ) : (
          <>
            <h3>Регистрация</h3>
            <div>
              <input
                type="email"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Подтверждение пароля"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button onClick={() => handleRegisterClick()}>Зарегистрироваться</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="list-container">
      {!props.userLoggedIn && (
        <>
          {currentTab === 'registration' && (
            <>
              <h3>Регистрация</h3>
              <div>
                <input
                  type="email"
                  placeholder="Электронная почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Подтверждение пароля"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button onClick={() => { handleRegisterClick(); }}>Зарегистрироваться</button>
            </>
          )}
  
          {currentTab === 'login' && (
            <>
              <h3>Вход</h3>
              <div>
                <input
                  type="email"
                  placeholder="Электронная почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button onClick={() => { handleLoginClick(); }}>Войти</button>
            </>
          )}
  
          {currentTab === 'createTask' && !initialStep && (
            <>
              <h3>Добавить новую задачу</h3>
              <CreateComponent onSave={(content) => handleSave(content)} className="task-input" />
              <button onClick={() => setShowTasks(!showTasks)}>
                {showTasks ? "Скрыть задачи" : "Показать все задачи"}
              </button>
              {showTasks && <ViewTasks />}
              {list &&
                list.map((item, key) => {
                  if (!item) return null;
                  return <ItemComponent key={item.id} data={item} onDelete={() => handleDelete(key)} />;
                })}
            </>
          )}
        </>
      )}
  
      {props.userLoggedIn && (
        <>
          <div>
          <button onClick={handleLogout}>Выйти</button>
          </div>
  
          <h3>Добавить новую задачу</h3>
          <CreateComponent onSave={(content) => handleSave(content)} className="task-input" />
  
          <button onClick={() => setShowTasks(!showTasks)}>
            {showTasks ? "Скрыть задачи" : "Показать все задачи"}
          </button>
  
          {showTasks && <ViewTasks />}
  
          {list &&
            list.map((item, key) => {
              if (!item) return null;
              return <ItemComponent key={item.id} data={item} onDelete={() => handleDelete(key)} />;
            })}
        </>
      )}
    </div>
  );
  
};

export default ListComponent;