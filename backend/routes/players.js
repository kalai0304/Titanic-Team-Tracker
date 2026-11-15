const router = require('express').Router();
const Player = require('../models/Player');
const auth = require('../middleware/auth');

// Anyone logged in can read
router.get('/', auth(), async (req, res) => {
  const players = await Player.find().sort({ createdAt: 1 });
  res.json(players);
});

// Only editor can create
router.post('/', auth('editor'), async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Only editor can update
router.put('/:id', auth('editor'), async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!player) return res.status(404).json({ error: 'Not found' });
    res.json(player);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Only editor can delete
router.delete('/:id', auth('editor'), async (req, res) => {
  await Player.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;