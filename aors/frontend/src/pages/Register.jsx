import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'user'
  });
  const nav = useNavigate();

  const submit = async () => {
    try {
      await API.post('/auth/register', form);
      alert('Registered successfully');
      nav('/');
    } catch (e) {
      alert(e.response?.data?.message || 'Error during registration');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      <div>
        <label>Role: </label>
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button onClick={submit}>Register</button>
    </div>
  );
}
