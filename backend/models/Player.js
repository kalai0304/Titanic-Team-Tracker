const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Batsman' },
  jerseyNo: { type: String, default: '' },
  tshirt: { 
    size: { type: String, default: 'L' }, 
    weight: { type: String, default: '' }, // <--- ADDED WEIGHT/CHEST HERE
    qty: { type: Number, default: 1 }, 
    sleeve: { type: String, enum: ['Half', 'Full', 'None'], default: 'Half' } 
  },
  pant: { size: { type: String, default: 'L' }, qty: { type: Number, default: 1 }, needed: { type: Boolean, default: true } },
  cap: { needed: { type: Boolean, default: true }, printType: { type: String, enum: ['name', 'number'], default: 'name' }, printText: { type: String, default: '' } },
  payment: { total: { type: Number, default: 0 }, paid: { type: Number, default: 0 }, mode: { type: String, enum: ['UPI', 'Cash', 'Bank'], default: 'UPI' } }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);