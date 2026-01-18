const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    donorName: {
      type: String,
      default: 'Anonymous'
    },
    donorEmail: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['gcash', 'bank'],
      required: true
    },
    transactionRef: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    },
    rejectionNotes: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    rejectionDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', DonationSchema);
