import React from 'react';
import { Route, Link } from 'react-router-dom';

import Header from './components/Header/Header';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import UserPage from './components/UserPage/UserPage';
import InfoPage from './components/InfoPage/InfoPage';
import Table from './components/Table/Table';

import './styles/main.css';

const App = () => (
  <div>
    <Route
      path="/"
      exact component={LoginPage}
    />
    <Route
      path="/register"
      component={RegisterPage}
    />
    <Route
      path="/user"
      component={UserPage}
    />
    <Route
      path="/info"
      component={InfoPage}
    />
    <Route
      path="/game"
      component={Table}
    />
  </div>
);

export default App;
