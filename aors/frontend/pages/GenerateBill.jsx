import React, { useState } from 'react';
import API from '../api';

export default function GenerateBill(){
  const [bookingId, setBookingId] = useState('');
  const [rows, setRows] = useState([{ description: '', cost: '' }]);

  const addRow = () => setRows([...rows, { description: '', cost: '' }]);

  const updateRow = (i, key, value) => {
    const copy = [...rows];
    copy[i][key] = value;
    setRows(copy);
  };

  const submit = async () => {
    try {
      const res = await API.post('/bill/generate', {
        bookingId,
        additionalCosts: rows
      });
      alert('Bill generated at: ' + res.data.billPath);
    } catch (e) {
      alert(e.response?.data?.message || 'Error generating bill');
    }
  };

  return (
    <div className="container">
      <h2>Generate Bill</h2>
      <input
        placeholder="Booking ID"
        value={bookingId}
        onChange={e => setBookingId(e.target.value)}
      />
      {rows.map((r, i) => (
        <div key={i}>
          <input
            placeholder="Description"
            value={r.description}
            onChange={e => updateRow(i, 'description', e.target.value)}
          />
          <input
            placeholder="Cost"
            value={r.cost}
            onChange={e => updateRow(i, 'cost', e.target.value)}
          />
        </div>
      ))}
      <div>
        <button onClick={addRow}>Add Cost</button>
        <button onClick={submit}>Generate Bill</button>
      </div>
    </div>
  );
}
