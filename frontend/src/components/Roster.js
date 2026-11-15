import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Roster({ user }) {
  const [players, setPlayers] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.getPlayers().then(setPlayers);
  useEffect(() => { load(); }, []);

  const statusOf = (p) => {
    const bal = (p.payment.total || 0) - (p.payment.paid || 0);
    if (bal <= 0) return { cls: 'paid-full', label: 'Paid' };
    if ((p.payment.paid || 0) > 0) return { cls: 'partial', label: 'Partial' };
    return { cls: 'unpaid', label: 'Unpaid' };
  };

  const initials = (name) => name.replace(/[^A-Za-z ]/g, '').split(/[ ,]+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const saveEdit = async (id, patch) => {
    await api.updatePlayer(id, patch);
    setEditing(null);
    load();
  };

  return (
    <div className="mobile-frame">
      <div className="slide-tag"><i className="fas fa-list-ul"></i> PLAYER ROSTER & PAYMENT</div>
      <div className="card">
        {players.map(p => {
          const s = statusOf(p);
          const bal = (p.payment.total || 0) - (p.payment.paid || 0);
          return (
            <div className="player-item" key={p._id}>
              <div className="player-top">
                <div className="player-info">
                  <div className="player-avatar">{initials(p.name)}</div>
                  <div>
                    <div className="player-name">{p.name}</div>
                    <div className="player-role">{p.role}</div>
                  </div>
                </div>
                <div className="jersey-badge">{p.jerseyNo || '—'}<small>Jersey {p.tshirt.size}</small></div>
              </div>
              <div className="spec-row">
                <span className="chip"><i className="fas fa-hand-scissors"></i> {p.tshirt.sleeve}-sleeve</span>
                <span className="chip"><i className="fas fa-socks"></i> Pant {p.pant.size}</span>
                <span className="chip ok"><i className={p.cap.printType === 'name' ? 'fas fa-font' : 'fas fa-hashtag'}></i> Cap: "{p.cap.printText}"</span>
                {p.tshirt.weight && <span className="chip warn"><i className="fas fa-weight-hanging"></i> {p.tshirt.weight}</span>}
              </div>
              <div className="payment-row">
                <div className="col"><span className="lbl">Total</span><span className="val">₹{p.payment.total}</span></div>
                <div className="col"><span className="lbl">Paid</span><span className="val paid">₹{p.payment.paid}</span></div>
                <div className="col"><span className="lbl">Balance</span><span className={`val ${bal > 0 ? 'bal' : ''}`}>₹{bal}</span></div>
                <span className={`status-pill ${s.cls}`}>{s.label}</span>
              </div>
              {user.role === 'editor' && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <button className="mini-btn" onClick={() => setEditing(p)}><i className="fas fa-pen"></i> Edit</button>
                  <button className="mini-btn danger" onClick={async () => { if (window.confirm('Delete player?')) { await api.deletePlayer(p._id); load(); } }}><i className="fas fa-trash"></i></button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {editing && <EditModal player={editing} onClose={() => setEditing(null)} onSave={saveEdit} />}
    </div>
  );
}

function EditModal({ player, onClose, onSave }) {
  const [paid, setPaid] = useState(player.payment.paid);
  const [total, setTotal] = useState(player.payment.total);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Edit Payment · {player.name}</h3>
        <label className="form-label">Total (₹)</label>
        <input className="form-input" type="number" value={total} onChange={e => setTotal(+e.target.value)} />
        <label className="form-label" style={{ marginTop: 10 }}>Paid (₹)</label>
        <input className="form-input" type="number" value={paid} onChange={e => setPaid(+e.target.value)} />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button className="btn-primary" onClick={() => onSave(player._id, { payment: { ...player.payment, total, paid } })}>Save</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}