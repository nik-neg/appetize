import './App.css';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { Switch, Route } from 'react-router-dom';
import { useState } from 'react';
import RegisterLogin from './components/RegisterLogin/RegisterLogin';
import Profile from './components/Profile/Profile';

function App() {
  const [isUserForRouting, setIsUserForRouting] = useState({
    id: null,
    isUser: false,
    loggedIn: false,
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
      {/* <Router>
      <Switch>
        <Route path="/register" >
          { !isUserForRouting.loggedIn ?
            <RegisterLogin
              isUserForRouting={isUserForRouting}
              onRegister={handleRegister}
              onLogin={handleLogin}
            />
            : ''}
        </Route>
        <Route path="/login" >
          { !isUserForRouting.loggedIn ?
            <RegisterLogin
              isUserForRouting={isUserForRouting}
              onRegister={handleRegister}
              onLogin={handleLogin}
            />
            : ''}
        </Route>

          { isUserForRouting.loggedIn ?
          <Route path={"/profile/"+isUserForRouting.id} >
            <Profile id={isUserForRouting.id}/>
          </Route>
          : '' } */}

      { !isUserForRouting.loggedIn
        ? (
          <RegisterLogin
            isUserForRouting={isUserForRouting}
            onRegister={handleRegister}
            onLogin={handleLogin}
          />
        )
        : '' }
      { isUserForRouting.loggedIn ? <Profile id={isUserForRouting.id} /> : '' }
      {/* </Switch>
      </Router> */}
    </div>
  );
}

export default App;
