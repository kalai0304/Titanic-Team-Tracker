import React, { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await api.login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="login-wrap">
      <div className="mobile-frame login-frame">
        <div className="login-header">
          <div className="team-icon"><i className="fas fa-ship"></i></div>
          <h1>TITANIC <span>CC</span></h1>
          <p>Kit & Payment Tracker</p>
        </div>
        <form onSubmit={submit}>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="form-label" style={{ marginTop: 12 }}>Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {err && <div className="error-msg">{err}</div>}
          <button className="btn-primary" type="submit" style={{ marginTop: 16 }}>
            <i className="fas fa-sign-in-alt"></i> Sign In
          </button>
        </form>
      </div>
    </div>
  );
}