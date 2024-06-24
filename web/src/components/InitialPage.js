import React, {Component} from 'react';
import SearchPage from './SearchPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from './Auth';
import Login from './LoginPage';

export default class InitialPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<p>TESTE ABCD=This is the init page but should navigate to /register that has an option for /login or a page that merges the two (which is probably better)</p>} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    );
  }
}