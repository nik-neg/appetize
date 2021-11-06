import './App.css';
import {Route, Router, Switch  } from 'react-router-dom';
// import { useState } from 'react';
import RegisterLogin from './components/RegisterLogin/RegisterLogin';
import Profile from './components/Profile/Profile';
import Details from './components/Details/Details';

import history from './history';

function App() {

  return (
    <div className="App">
      <Router history={history}>
        <Switch>
            <Route exact path="/" component={RegisterLogin}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/details/:dishId" component={Details}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
