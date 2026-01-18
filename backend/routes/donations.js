const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const nodemailer = require('nodemailer');
const { authenticateAdmin } = require('../middleware/auth');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Donation submission route
router.post('/', async (req, res) => {
  try {
    const { amount, donorName, donorEmail, paymentMethod, transactionRef } = req.body;

    // Validate required fields
    if (!amount || !donorEmail || !paymentMethod || !transactionRef) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['amount', 'donorEmail', 'paymentMethod', 'transactionRef']
      });
    }

    // Validate payment method
    if (!['gcash', 'bank'].includes(paymentMethod)) {
      return res.status(400).json({ 
        error: 'Invalid payment method. Must be gcash or bank' 
      });
    }

    // Check if transaction reference already exists
    const existingDonation = await Donation.findOne({ transactionRef });
    if (existingDonation) {
      return res.status(400).json({ 
        error: 'This transaction reference has already been submitted' 
      });
    }

    // Create new donation
    const donation = new Donation({
      amount: parseFloat(amount),
      donorName: donorName || 'Anonymous',
      donorEmail,
      paymentMethod,
      transactionRef,
      status: 'pending'
    });

    // Save to database
    await donation.save();

    // Send confirmation email to donor
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donorEmail,
      subject: 'Donation Received - IMMFI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">Thank You for Your Donation!</h2>
          <p>Dear ${donorName || 'Valued Donor'},</p>
          <p>We have received your donation of <strong>₱${parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> via ${paymentMethod === 'gcash' ? 'GCash' : 'Bank Transfer'}.</p>
          <p><strong>Transaction Reference:</strong> ${transactionRef}</p>
          <p>Your donation is currently being verified. Once verified, you will receive a confirmation email within 24 hours.</p>
          <p>Your generosity helps us support children with disabilities and build a more inclusive future.</p>
          <p style="margin-top: 20px;">With gratitude,<br>The IMMFI Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Send notification email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Donation Received - Manual Verification Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">New Donation Submitted</h2>
          <p><strong>Amount:</strong> ₱${parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Donor Name:</strong> ${donorName || 'Anonymous'}</p>
          <p><strong>Donor Email:</strong> ${donorEmail}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === 'gcash' ? 'GCash' : 'Bank Transfer'}</p>
          <p><strong>Transaction Reference:</strong> ${transactionRef}</p>
          <p><strong>Status:</strong> Pending Verification</p>
          <p>Please verify this donation in the admin dashboard and mark it as verified once confirmed.</p>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);

    // Send success response
    res.status(201).json({
      message: 'Donation submitted successfully. Please check your email for confirmation.',
      donation: {
        id: donation._id,
        amount: donation.amount,
        donorEmail: donation.donorEmail,
        paymentMethod: donation.paymentMethod,
        transactionRef: donation.transactionRef,
        status: donation.status,
      }
    });

  } catch (error) {
    console.error('Error in donation submission:', error);
    res.status(500).json({ 
      error: 'Failed to submit donation',
      details: error.message 
    });
  }
});

// Get all donations
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const donations = await Donation.find({}).sort({ createdAt: -1 });
    
    res.json({
      donations: donations.map(d => ({
        id: d._id,
        amount: d.amount,
        donorName: d.donorName,
        donorEmail: d.donorEmail,
        paymentMethod: d.paymentMethod,
        transactionRef: d.transactionRef,
        status: d.status,
        notes: d.notes,
        createdAt: d.createdAt,
        verifiedAt: d.verifiedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch donations',
      details: error.message
    });
  }
});

// Verify and approve a donation
router.post('/:id/verify', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, receiptImage } = req.body;

    console.log('Verify endpoint called for donation ID:', id);
    console.log('Receipt image size:', receiptImage ? receiptImage.length : 'none');

    const donation = await Donation.findById(id);
    
    if (!donation) {
      console.log('Donation not found with ID:', id);
      return res.status(404).json({ error: 'Donation not found' });
    }

    console.log('Found donation, updating status to verified');

    // Update donation status
    donation.status = 'verified';
    donation.verifiedAt = new Date();
    if (notes) donation.notes = notes;
    await donation.save();

    console.log('Donation saved successfully, sending email');

    // Send verification email to donor with receipt
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donation.donorEmail,
      subject: 'Your Donation Has Been Verified - IMMFI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">Thank You for Your Donation!</h2>
          <p>Dear ${donation.donorName},</p>
          <p>We are pleased to confirm that your donation of <strong>₱${donation.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> has been verified and received.</p>
          <p><strong>Transaction Reference:</strong> ${donation.transactionRef}</p>
          <p><strong>Payment Method:</strong> ${donation.paymentMethod === 'gcash' ? 'GCash' : 'Bank Transfer'}</p>
          <p><strong>Date Verified:</strong> ${new Date(donation.verifiedAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          ${receiptImage ? `
          <div style="margin: 20px 0; text-align: center;">
            <h3 style="color: #2E7D32;">Receipt</h3>
            <img src="cid:receiptImage" alt="Receipt" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; padding: 5px;">
          </div>
          ` : ''}
          
          <p style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #2E7D32;">
            Your generous support helps us continue our mission of supporting children with disabilities and their families. 
            Every peso makes a real difference in their lives.
          </p>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p style="margin-top: 20px;">With heartfelt gratitude,<br>The IMMFI Team</p>
        </div>
      `,
      attachments: receiptImage ? [
        {
          filename: 'receipt.png',
          content: Buffer.from(receiptImage.split(',')[1], 'base64'),
          cid: 'receiptImage'
        }
      ] : []
    };

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');

    res.json({ 
      message: 'Donation verified successfully and email sent to donor',
      donation 
    });
  } catch (error) {
    console.error('Error verifying donation:', error);
    console.error('Error details:', error.message);
    console.error('Full error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to verify donation',
      details: error.message 
    });
  }
});

// Get donation statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const donations = await Donation.find({});
    
    const stats = {
      total: donations.reduce((acc, d) => acc + d.amount, 0),
      count: donations.length,
      verified: donations.filter(d => d.status === 'verified').length,
      pending: donations.filter(d => d.status === 'pending').length,
      rejected: donations.filter(d => d.status === 'rejected').length,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ error: 'Failed to fetch donation statistics' });
  }
});

// Reject donation endpoint
router.post('/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // Find the donation
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Update donation status to rejected
    donation.status = 'rejected';
    donation.rejectionNotes = notes || '';
    donation.rejectionDate = new Date();
    await donation.save();

    // Send rejection email to donor
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donation.donorEmail,
      subject: 'Donation Status Update - IMMFI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #D32F2F; margin-bottom: 20px;">Donation Status Update</h2>
          
          <p>Hello ${donation.donorName || 'Valued Donor'},</p>
          
          <p>We wanted to inform you that your donation submission with reference <strong>${donation.transactionRef}</strong> could not be verified at this time.</p>
          
          ${notes ? `
            <div style="background-color: #fff3cd; border-left: 4px solid #D32F2F; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">Reason for Rejection:</p>
              <p style="margin: 5px 0 0 0;">${notes}</p>
            </div>
          ` : ''}
          
          <p style="margin-top: 20px;">This could be due to various reasons such as:</p>
          <ul style="color: #666;">
            <li>Transaction reference not found or already submitted</li>
            <li>Amount mismatch</li>
            <li>Missing or unclear documentation</li>
            <li>Payment method not properly documented</li>
          </ul>
          
          <p style="margin-top: 20px;">Please contact us if you believe this is in error or if you have any questions about your donation. We appreciate your interest in supporting IMMFI's mission.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>The IMMFI Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Donation rejected and notification sent to donor',
      donation 
    });
  } catch (error) {
    console.error('Error rejecting donation:', error);
    res.status(500).json({ 
      error: 'Failed to reject donation',
      details: error.message 
    });
  }
});

module.exports = router;
