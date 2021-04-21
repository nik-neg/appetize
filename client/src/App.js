import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import RegisterLogin from './components/RegisterLogin/RegisterLogin';

function App() {
  const [isUserForRouting, setIsUser] = useState(false);

  const handleRegister = (isUserRegistered) => {
    setIsUser({
      isUser: isUserRegistered
    });
  }

  return (
    <div className="App">
    <Router>
      <RegisterLogin isUserForRouting={isUserForRouting} onRegister={handleRegister}/>
      {/* <Profile isUser={isUser} onRegister={handleRegister}/> */}
    </Router>
    </div>
  );
}

export default App;
