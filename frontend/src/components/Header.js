
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./css/Header.css";

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
      <Link to="/mypage" className="button1">My Page</Link>
      <Link to="/post" className="button2">New Post</Link>
      <Link to="/users" className="button3">Users</Link>
      <button onClick={handleLogout}  className="button4">Logout</button>
        </nav>
    </header>
    
   /*
   <div>
      <div class="button1">
          <a href="/mypage">My Page</a>
      </div>
      <div class="button2">
          <a href="post">New Post</a> 
      </div>
      <div class="button3">
          <a href="users">Users</a> 
      </div>
      <div class="button4">
      <button onClick={handleLogout}><a>Logout</a></button>
      </div>
     </div>
     */
  );
};

export default Header;
