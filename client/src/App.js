import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import RegisterLogin from './components/RegisterLogin/RegisterLogin';
import Profile from './components/Profile/Profile';

function App() {
  const [isUserForRouting, setIsUserForRouting] = useState({
    id: null,
    isUser: false,
    loggedIn: false
  });

  const handleRegister = (isUserRegistered) => {
    setIsUserForRouting({
      isUser: isUserRegistered,
    });
  };

  const handleLogin = (userID) => {
    setIsUserForRouting({
      id: userID,
      loggedIn: true,
    });
  };

  return (
    <div className="App">
      <Router>
        { !isUserForRouting.loggedIn ?
          <RegisterLogin
            isUserForRouting={isUserForRouting}
            onRegister={handleRegister}
            onLogin={handleLogin}
          />
          : '' }
        { isUserForRouting.loggedIn ? <Profile id={isUserForRouting.id}/> : '' }
      </Router>
    </div>
  );
}

export default App;
