import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const users = new Map();

// JWT Generator
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    secret,
    { expiresIn: '7d' }
  );
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Username, email, and password are required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existingUser = Array.from(users.values()).find(
      (u) => u.username === username || u.email === email
    );
    if (existingUser)
      return res.status(409).json({ message: 'Username or email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      preferences: {
        tempUnit: 'celsius',
        windUnit: 'kmh',
        notifications: true,
        theme: 'light',
      },
      createdAt: new Date().toISOString(),
    };

    users.set(userId, newUser);
    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    const user = Array.from(users.values()).find(
      (u) => u.username === username || u.email === username
    );
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Get Current User
router.get('/me', authenticateToken, (req, res) => {
  const user = users.get(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword); // ✅ Fixed: return user directly
});

// Update Preferences
router.put('/preferences', authenticateToken, (req, res) => {
  try {
    const user = users.get(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { preferences } = req.body;
    if (!preferences || typeof preferences !== 'object')
      return res.status(400).json({ message: 'Valid preferences object required' });

    user.preferences = { ...user.preferences, ...preferences };
    users.set(req.user.id, user);

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Preferences updated successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;
