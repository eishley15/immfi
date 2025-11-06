const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  // In production, use environment variables for credentials and hash passwords
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

module.exports = { authenticateAdmin, loginAdmin };