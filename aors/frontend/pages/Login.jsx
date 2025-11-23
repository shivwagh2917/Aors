import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const doLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      const role = res.data.user.role;
      if (role === 'admin') nav('/admin/products');
      else if (role === 'worker') nav('/worker');
      else nav('/dashboard');
    } catch (e) {
      alert(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <div>
        <button onClick={doLogin}>Login</button>
      </div>
      <div>
        <small>Don't have an account? <a href="/register">Register</a></small>
      </div>
    </div>
  );
}
