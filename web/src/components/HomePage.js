import React, {Component} from 'react';
import SearchPage from './SearchPage';
import LoginPage from './LoginPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<p>This is the home page</p>} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }
}