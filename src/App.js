import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListComponent from './components/ListComponent';
import ChatComponent from './components/ChatComponent';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            {userLoggedIn && (
              <>
                <li><Link to="/tasks">Главная</Link></li>
                <li><Link to="/chat">Чат</Link></li>
              </>
            )}
            {!userLoggedIn && (
              <>
                <li><Link to="/login">Вход</Link></li>
                <li><Link to="/registration">Регистрация</Link></li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route
            path="/tasks"
            element={<ListComponent userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />}
          />
          <Route path="/chat" element={<ChatComponent />} />
          {/* Добавлены маршруты для страниц входа и регистрации */}
          <Route
            path="/login"
            element={<LoginPage setUserLoggedIn={setUserLoggedIn} />}
          />
          <Route
            path="/registration"
            element={<RegistrationPage setUserLoggedIn={setUserLoggedIn} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
