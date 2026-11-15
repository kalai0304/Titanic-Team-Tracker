const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
});

// POST /api/auth/register  (use once to create editors; then disable)
router.post('/register', async (req, res) => {
  const { email, password, role, name } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash, role, name });
  res.json({ id: user._id, email: user.email, role: user.role });
});

module.exports = router;