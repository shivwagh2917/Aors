import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data.user);
      } catch (e) {
        // ignore
      }
    };
    getMe();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = '/';
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Dashboard</h2>
        <div>
          <span className="roleBadge">{localStorage.getItem('userRole') || ''}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <nav>
        <Link to="/bookings">Bookings</Link> |{' '}
        <Link to="/generate-bill">Generate Bill</Link>
      </nav>
      <p>Welcome {user?.name || 'user'} — use the menu to navigate.</p>
    </div>
  );
}
