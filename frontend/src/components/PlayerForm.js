import React, { useState } from 'react';
import { api } from '../api';

export default function PlayerForm({ onDone }) {
  const [f, setF] = useState({
    name: '', 
    role: 'Batsman', 
    jerseyNo: '',
    tshirt: { size: 'L', weight: '', qty: 1, sleeve: 'Half' }, // Added weight
    pant: { size: 'L', qty: 1, needed: true },
    cap: { needed: true, printType: 'name', printText: '' },
    payment: { total: 600, paid: 0, mode: 'UPI' }
  });
  const [err, setErr] = useState('');

  const set = (path, val) => {
    const parts = path.split('.');
    const copy = JSON.parse(JSON.stringify(f));
    let cur = copy;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = val;
    setF(copy);
  };

  const submit = async (e) => {
    e.preventDefault();
    try { 
      await api.addPlayer(f); 
      onDone(); 
    } catch (e) { 
      setErr(e.message); 
    }
  };

  return (
    <div className="mobile-frame">
      <div className="slide-tag"><i className="fas fa-user-plus"></i> ADD PLAYER</div>
      
      <form onSubmit={submit} className="card">
        
        {/* PLAYER INFO */}
        <div className="section-label"><i className="fas fa-id-card"></i> Player Info</div>
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input className="form-input" required value={f.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={f.role} onChange={e => set('role', e.target.value)}>
              <option>Batsman</option><option>Bowler</option><option>All-rounder</option><option>Wicket-keeper</option><option>Coach</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Jersey No.</label>
            <input className="form-input" value={f.jerseyNo} onChange={e => set('jerseyNo', e.target.value)} />
          </div>
        </div>

        {/* T-SHIRT */}
        <div className="section-label" style={{ marginTop: 16 }}><i className="fas fa-tshirt"></i> T-Shirt</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Size</label>
            <select className="form-select" value={f.tshirt.size} onChange={e => set('tshirt.size', e.target.value)}>
              <option value="S">S (34")</option>
              <option value="M">M (38")</option>
              <option value="L">L (40")</option>
              <option value="XL">XL (42")</option>
              <option value="XXL">XXL (44")</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Qty</label>
            <input className="form-input" type="number" min="1" value={f.tshirt.qty} onChange={e => set('tshirt.qty', +e.target.value)} />
          </div>
        </div>
        
        {/* NEW WEIGHT/CHEST FIELD */}
        <div className="form-group">
          <label className="form-label">Weight / Chest (Optional)</label>
          <input className="form-input" placeholder="e.g. 85 kg or 40 inches" value={f.tshirt.weight || ''} onChange={e => set('tshirt.weight', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Sleeve Type</label>
          <div className="chip-group">
            {['Half', 'Full', 'None'].map(s => (
              <div key={s} className={`chip-opt ${f.tshirt.sleeve === s ? 'active' : ''}`} onClick={() => set('tshirt.sleeve', s)}>
                {s === 'None' ? 'No T-Shirt' : `${s} Sleeve`}
              </div>
            ))}
          </div>
        </div>

        {/* PANT */}
        <div className="section-label" style={{ marginTop: 16 }}><i className="fas fa-socks"></i> Pant</div>
        <div className="form-group">
          <label className="form-label">Need Pant?</label>
          <div className="chip-group">
            <div className={`chip-opt ${f.pant.needed ? 'active' : ''}`} onClick={() => set('pant.needed', true)}>Yes</div>
            <div className={`chip-opt ${!f.pant.needed ? 'active' : ''}`} onClick={() => set('pant.needed', false)}>No</div>
          </div>
        </div>
        
        {f.pant.needed && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Size</label>
              <select className="form-select" value={f.pant.size} onChange={e => set('pant.size', e.target.value)}>
                <option value="S">S (30")</option>
                <option value="M">M (32")</option>
                <option value="L">L (34")</option>
                <option value="XL">XL (36")</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Qty</label>
              <input className="form-input" type="number" min="1" value={f.pant.qty} onChange={e => set('pant.qty', +e.target.value)} />
            </div>
          </div>
        )}

        {/* CAP */}
        <div className="section-label" style={{ marginTop: 16 }}><i className="fas fa-hat-cowboy"></i> Cap</div>
        <div className="form-group">
          <label className="form-label">Need Cap?</label>
          <div className="chip-group">
            <div className={`chip-opt ${f.cap.needed ? 'active' : ''}`} onClick={() => set('cap.needed', true)}>Yes</div>
            <div className={`chip-opt ${!f.cap.needed ? 'active' : ''}`} onClick={() => set('cap.needed', false)}>No</div>
          </div>
        </div>

        {f.cap.needed && (
          <>
            <div className="form-group">
              <label className="form-label">Print on Cap</label>
              <div className="cap-choice">
                <div className={`cap-opt ${f.cap.printType === 'name' ? 'active' : ''}`} onClick={() => set('cap.printType', 'name')}>
                  <i className="fas fa-font"></i> Print NAME<br/><small style={{fontWeight:500,color:'#7d97b3'}}>e.g. SHARMA</small>
                </div>
                <div className={`cap-opt ${f.cap.printType === 'number' ? 'active' : ''}`} onClick={() => set('cap.printType', 'number')}>
                  <i className="fas fa-hashtag"></i> Print NUMBER<br/><small style={{fontWeight:500,color:'#7d97b3'}}>e.g. 07</small>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Cap Text / Number</label>
              <input className="form-input" value={f.cap.printText} onChange={e => set('cap.printText', e.target.value)} placeholder="SHARMA or 07" />
            </div>
          </>
        )}

        {/* PAYMENT */}
        <div className="section-label" style={{ marginTop: 16 }}><i className="fas fa-wallet"></i> Payment</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Total Amount</label>
            <div className="rupee-wrap">
              <span className="rupee-sym">₹</span>
              <input className="form-input" type="number" value={f.payment.total} onChange={e => set('payment.total', +e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Amount Paid</label>
            <div className="rupee-wrap">
              <span className="rupee-sym">₹</span>
              <input className="form-input" type="number" value={f.payment.paid} onChange={e => set('payment.paid', +e.target.value)} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Payment Mode</label>
          <div className="chip-group">
            {['UPI', 'Cash', 'Bank'].map(m => (
              <div key={m} className={`chip-opt ${f.payment.mode === m ? 'active' : ''}`} onClick={() => set('payment.mode', m)}>{m}</div>
            ))}
          </div>
        </div>

        {/* Auto Balance Display */}
        <div style={{ background:'#f2f9fe', borderRadius:14, padding:10, marginBottom:16, fontSize:11, color:'#41658b', fontWeight:600 }}>
          <i className="fas fa-calculator" style={{ color:'#0f5b9c' }}></i> 
          Balance auto: <b style={{ color: (f.payment.total - f.payment.paid) > 0 ? '#b45309' : '#1e6b3f' }}>₹{f.payment.total - f.payment.paid}</b> 
          {' '}· Status: <b style={{ color: (f.payment.total - f.payment.paid) > 0 ? '#b45309' : '#1e6b3f' }}>
            {(f.payment.total - f.payment.paid) > 0 ? (f.payment.paid > 0 ? 'PARTIAL' : 'UNPAID') : 'PAID'}
          </b>
        </div>

        {err && <div className="error-msg">{err}</div>}
        
        <button className="btn-primary" type="submit"><i className="fas fa-floppy-disk"></i> Save Player</button>
        <div style={{ height: 10 }}></div>
        <button type="button" className="btn-secondary" onClick={onDone}><i className="fas fa-arrow-left"></i> Cancel</button>
      </form>
    </div>
  );
}