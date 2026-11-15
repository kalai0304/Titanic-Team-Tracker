import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Roster from './components/Roster';
import PlayerForm from './components/PlayerForm';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="app-shell">
      <div className="topbar">
        <span>TITANIC CC · {user.role === 'editor' ? 'Editor' : 'Viewer'}</span>
        <button className="logout" onClick={logout}>Logout</button>
      </div>

      <div className="tabs">
        <button className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>Dashboard</button>
        <button className={page === 'roster' ? 'active' : ''} onClick={() => setPage('roster')}>Roster</button>
        {user.role === 'editor' && (
          <button className={page === 'add' ? 'active' : ''} onClick={() => setPage('add')}>+ Add</button>
        )}
      </div>

      {page === 'dashboard' && <Dashboard user={user} />}
      {page === 'roster' && <Roster user={user} />}
      {page === 'add' && user.role === 'editor' && <PlayerForm onDone={() => setPage('roster')} />}
    </div>
  );
}