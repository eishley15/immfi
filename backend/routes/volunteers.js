const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
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

// Volunteer signup route - POST /api/volunteers/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, availability, skills, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ 
        error: 'Email already registered as volunteer' 
      });
    }

    // Create new volunteer
    const volunteer = new Volunteer({
      name,
      email,
      phone,
      availability,
      skills,
      message,
    });

    // Save to database
    await volunteer.save();

    // Send success response
    res.status(201).json({
      message: 'Volunteer registration successful',
      volunteer: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        status: volunteer.status,
      }
    });

  } catch (error) {
    console.error('Error in volunteer signup:', error);
    res.status(500).json({ 
      error: 'Failed to register volunteer',
      details: error.message 
    });
  }
});

// Get all volunteers
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

// Approve volunteer and send email
router.post('/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    // Update volunteer status
    volunteer.status = 'approved';
    await volunteer.save();

    // Send approval email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: volunteer.email,
      subject: 'Your IMMFI Volunteer Application Has Been Approved!',
      html: `
        <h1>Welcome to the IMMFI Volunteer Team!</h1>
        <p>Dear ${volunteer.name},</p>
        <p>We're excited to inform you that your volunteer application has been approved! Thank you for your interest in supporting our mission.</p>
        <p>We will contact you when volunteer opportunities that match your skills become available.</p>
        <p>Your skills and interests: ${volunteer.skills || 'Not specified'}</p>
        <p>Your indicated availability: ${volunteer.availability || 'Not specified'}</p>
        <br>
        <p>Best regards,</p>
        <p>The IMMFI Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Volunteer approved and email sent successfully',
      volunteer 
    });
  } catch (error) {
    console.error('Error approving volunteer:', error);
    res.status(500).json({ 
      error: 'Failed to approve volunteer and send email',
      details: error.message 
    });
  }
});

module.exports = router;
