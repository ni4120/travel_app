/*
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Post from './components/Post';
import Top from './components/Top';


const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
        <Route path="/" element={<Top />} />
          <Route path="/home" element={<Home />} />
          <Route path="/post" element={<Post />} />
         
        </Routes>
      </div>
    </Router>
  );
};

export default App;
*/
// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Post from './components/Post';
import Top from './components/Top';
import Login from './components/Login';
import Register from './components/Register';
import MyPage from './components/MyPage';
import Users from './components/Users';
import UserSpots from './components/UserSpots';
import axios from 'axios'; 



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/api/check-auth', { withCredentials: true })
      .then(response => {
        setIsLoggedIn(response.data.isLoggedIn);
      })
      .catch(error => {
        console.error('Error checking auth status:', error);
      });
  }, []);


  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/post" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user-spots/:userId" element={<UserSpots />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
