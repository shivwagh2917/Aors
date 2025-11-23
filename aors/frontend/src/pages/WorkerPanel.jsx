import React from 'react';
import { Link } from 'react-router-dom';

export default function WorkerPanel(){
  const logout = () => {
    localStorage.clear();
    window.location = '/';
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Worker Panel</h2>
        <div>
          <span className="roleBadge">Worker</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <nav>
        <Link to="/bookings">My Requests</Link> |{' '}
        <Link to="/generate-bill">Generate Bill</Link>
      </nav>
      <p>
        Use the Bookings page to accept repair requests and the Generate Bill page to create invoices after completing work.
      </p>
    </div>
  );
}
