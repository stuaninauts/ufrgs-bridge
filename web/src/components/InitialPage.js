import React, {Component} from 'react';
import SearchPage from './SearchPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default class InitialPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<p>This is the init page but should navigate to /register that has an option for /login or a page that merges the two (which is probably better)</p>} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    );
  }
}