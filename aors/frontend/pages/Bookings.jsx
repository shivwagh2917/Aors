import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Bookings(){
  const [bookings, setBookings] = useState([]);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch (e) {
      alert('Error fetching bookings');
    }
  };

  const accept = async id => {
    try {
      await API.post(`/bookings/${id}/accept`);
      fetchBookings();
    } catch (e) {
      alert('Error accepting booking');
    }
  };

  const role = localStorage.getItem('userRole');

  return (
    <div className="container">
      <h2>Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Worker</th>
            <th>Service</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b._id}</td>
              <td>{b.user?.name}</td>
              <td>{b.worker?.name}</td>
              <td>{b.service}</td>
              <td>{b.status}</td>
              <td>
                {b.status === 'pending' && (role === 'worker' || role === 'admin') && (
                  <button onClick={() => accept(b._id)}>Accept</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
