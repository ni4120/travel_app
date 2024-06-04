import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Header = () => {

  const handleLogout = () => {
    const confirmed = window.confirm('ログアウトしますか?');
    if (!confirmed) {
      return;
    }
    axios.get('http://localhost:3001/api/logout')
      .then(response => {
        if (response.data.success) {
          window.location.href = '/';
        } else {
          alert('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error logging out:', error);
        alert('Logout failed');
      });
  };
  return (  
    <header className="mb-12 font-semibold">
      <nav className="mx-auto flex max-w-2xl items-center justify-between p-4 lg:px-8">
        <Link to="/mypage">My Page</Link>
        <Link to="/post">New Post</Link>
        <Link to="/users">Users</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>

  );
};

export default Header;
