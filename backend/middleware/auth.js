const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Log = require('../models/Log');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.socket.remoteAddress ||
         'Unknown';
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user in database
    const user = await User.findOne({ username });

    if (!user) {
      // Log failed login attempt
      await Log.create({
        username: username,
        action: 'login_failed',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        reason: 'User not found'
      });

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await Log.create({
        username: user.username,
        action: 'login_failed',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        reason: 'Invalid password'
      });

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Log successful login
    await Log.create({
      username: user.username,
      action: 'login_success',
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent']
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        userId: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const user = req.user;

    // Log logout
    await Log.create({
      username: user.username,
      action: 'logout',
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent']
    });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Server error during logout' });
  }
};

module.exports = { authenticateAdmin, loginAdmin, logoutAdmin };