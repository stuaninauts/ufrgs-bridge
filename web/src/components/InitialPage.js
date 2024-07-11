import React, {Component} from 'react';
import SearchPage from './SearchPage';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from './Auth';

export default class InitialPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    );
  }
}