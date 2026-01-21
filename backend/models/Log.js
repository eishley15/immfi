const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login_success', 'login_failed', 'logout']
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  reason: {
    type: String
  }
});

module.exports = mongoose.model('Log', logSchema);
