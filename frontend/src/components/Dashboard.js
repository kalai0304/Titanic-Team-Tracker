import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [players, setPlayers] = useState([]);
  useEffect(() => { api.getPlayers().then(setPlayers).catch(console.error); }, []);

  const t = players.reduce((a, p) => {
    a.total += p.payment.total; a.paid += p.payment.paid;
    if (p.payment.paid >= p.payment.total) a.paidCount++;
    else if (p.payment.paid > 0) a.partialCount++;
    else a.unpaidCount++;
    return a;
  }, { total: 0, paid: 0, paidCount: 0, partialCount: 0, unpaidCount: 0 });

  const pending = t.total - t.paid;
  const pct = t.total ? Math.round((t.paid / t.total) * 100) : 0;

  return (
    <div className="mobile-frame">
      <div className="slide-tag"><i className="fas fa-gauge-high"></i> TEAM DASHBOARD</div>

      <div className="big-number-card">
        <div className="lbl">Total to collect</div>
        <div className="big">₹{t.total.toLocaleString('en-IN')}</div>
        <div className="sub-row">
          <div><span className="k">Collected</span><span className="v green">₹{t.paid.toLocaleString('en-IN')}</span></div>
          <div><span className="k">Pending</span><span className="v yellow">₹{pending.toLocaleString('en-IN')}</span></div>
          <div><span className="k">Players</span><span className="v">{players.length}</span></div>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div>
        <div style={{ fontSize: 10, color: '#9ac2e6', marginTop: 8, fontWeight: 600 }}>
          <i className="fas fa-circle-info"></i> {pct}% collected · {t.paidCount}/{players.length} players fully paid
        </div>
      </div>

      <div className="mini-grid">
        <div className="mini-card">
          <div className="lbl"><i className="fas fa-users"></i> Players</div>
          <div className="val">{players.length}</div>
          <div className="note">{t.paidCount} paid · {t.partialCount} partial · {t.unpaidCount} unpaid</div>
        </div>
        <div className="mini-card">
          <div className="lbl"><i className="fas fa-tshirt"></i> T-Shirts</div>
          <div className="val">{players.filter(p => p.tshirt.sleeve !== 'None').length}</div>
          <div className="note">Half: {players.filter(p => p.tshirt.sleeve === 'Half').length} · Full: {players.filter(p => p.tshirt.sleeve === 'Full').length}</div>
        </div>
        <div className="mini-card">
          <div className="lbl"><i className="fas fa-socks"></i> Pants</div>
          <div className="val">{players.filter(p => p.pant.needed).length}</div>
          <div className="note">Ordered</div>
        </div>
        <div className="mini-card">
          <div className="lbl"><i className="fas fa-hat-cowboy"></i> Caps</div>
          <div className="val">{players.filter(p => p.cap.needed).length}</div>
          <div className="note">Name: {players.filter(p => p.cap.printType === 'name').length} · Num: {players.filter(p => p.cap.printType === 'number').length}</div>
        </div>
      </div>
    </div>
  );
}