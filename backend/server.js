require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Volunteer = require('./models/Volunteer');
const galleryRoutes = require('./routes/gallery');
const { authenticateAdmin, loginAdmin } = require('./middleware/auth');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// PayMongo Configuration
console.log('PayMongo Secret Key:', process.env.PAYMONGO_SECRET_KEY ? 'Loaded' : 'Missing');
console.log('PayMongo Public Key:', process.env.PAYMONGO_PUBLIC_KEY ? 'Loaded' : 'Missing');

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_PUBLIC_KEY = process.env.PAYMONGO_PUBLIC_KEY;
const PAYMONGO_BASE_URL = 'https://api.paymongo.com/v1';


// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Debug middleware for image requests
app.use('/images', (req, res, next) => {
  console.log('Image request:', req.url);
  console.log('Full path:', path.join(__dirname, 'public/images', req.url));
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/immfi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

app.use('/images', express.static(path.join(__dirname, 'public/images'), {
  caseSensitive: false,
  etag: true
}));

app.get('/images/gallery-images/:filename', (req, res, next) => {
  const filePath = path.join(__dirname, 'public/images/gallery-images', req.params.filename);
  console.log('Requested image:', req.params.filename);
  console.log('Looking for file at:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // List what files are actually there
    const dir = path.join(__dirname, 'public/images/gallery-images');
    const files = fs.readdirSync(dir);
    console.log('Available files:', files);
    res.status(404).json({ error: 'File not found', available: files });
  }
});

// Routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, description, metadata } = req.body;

    // Validate required fields (only amount and email are required)
    if (!amount || !metadata?.donor_email) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Amount and email are required'
      });
    }

    // Create a checkout session
    const response = await axios.post(
      `${PAYMONGO_BASE_URL}/checkout_sessions`,
      {
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: description || 'Donation to IMMFI',
            line_items: [
              {
                currency: 'PHP',
                amount: Math.round(amount * 100),
                description: description || 'Donation to IMMFI',
                name: metadata.donor_name ? `Donation from ${metadata.donor_name}` : 'Anonymous Donation',
                quantity: 1
              }
            ],
            payment_method_types: ['card', 'gcash', 'grab_pay', 'paymaya'],
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/donate?status=success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/donate?status=cancelled`,
            metadata: {
              ...metadata,
              donor_name: metadata.donor_name || 'Anonymous'
            }
          }
        }
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const checkoutSession = response.data.data;
    console.log('Checkout Session Created:', checkoutSession);

    res.json({
      checkoutUrl: checkoutSession.attributes.checkout_url,
      sessionId: checkoutSession.id
    });

  } catch (error) {
    console.error('PayMongo Error:', error.response?.data || error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.response?.data?.errors || error.message
    });
  }
});

app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId || !paymentMethodId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Attach payment method
    await axios.post(
      `${PAYMONGO_BASE_URL}/payment_intents/${paymentIntentId}/attach`,
      {
        data: {
          attributes: {
            payment_method: paymentMethodId
          }
        }
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Retrieve the confirmed payment
    const response = await axios.get(
      `${PAYMONGO_BASE_URL}/payment_intents/${paymentIntentId}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`
        }
      }
    );

    const confirmedPayment = response.data.data;

    res.json({
      status: confirmedPayment.attributes.status,
      paymentIntentId: confirmedPayment.id,
      amount: confirmedPayment.attributes.amount,
    });
  } catch (error) {
    console.error('Error confirming payment:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Failed to confirm payment', 
      details: error.response?.data?.errors || error.message 
    });
  }
});

app.get('/api/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const response = await axios.get(
      `${PAYMONGO_BASE_URL}/payment_intents/${paymentIntentId}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`
        }
      }
    );
    
    const payment = response.data.data;
    
    res.json({
      status: payment.attributes.status,
      amount: payment.attributes.amount,
      currency: payment.attributes.currency,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to retrieve payment status' });
  }
});

// Get available payment methods
app.get('/api/payment-methods', async (req, res) => {
  try {
    // Return default payment methods since PayMongo doesn't have a direct list endpoint
    res.json({
      methods: [
        { id: 'card', type: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, JCB' },
        { id: 'gcash', type: 'gcash', name: 'GCash', description: 'Pay with GCash wallet' },
        { id: 'paymaya', type: 'paymaya', name: 'PayMaya', description: 'Pay with PayMaya wallet' },
      ]
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Get checkout session details
app.get('/api/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const response = await axios.get(
      `${PAYMONGO_BASE_URL}/checkout_sessions/${sessionId}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`
        }
      }
    );
    
    const session = response.data.data;
    
    res.json({
      status: session.attributes.payment_intent?.attributes?.status || session.attributes.status,
      amount: session.attributes.line_items[0]?.amount,
      currency: session.attributes.line_items[0]?.currency,
      payments: session.attributes.payments
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to retrieve checkout session' });
  }
});

// Volunteer signup route
app.post('/api/volunteer-signup', async (req, res) => {
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

// Update the admin login route
app.post('/api/admin/login', loginAdmin);

// Get all volunteers
app.get('/api/volunteers', authenticateAdmin, async (req, res) => {
  try {
    const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

// Approve volunteer and send email
app.post('/api/volunteers/:id/approve', authenticateAdmin, async (req, res) => {
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

// Get all donations
app.get('/api/donations', authenticateAdmin, async (req, res) => {
  try {
    const response = await axios.get(
      `${PAYMONGO_BASE_URL}/payments`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const payments = response.data.data;

    const donations = payments.map(payment => ({
      id: payment.id,
      amount: payment.attributes.amount,
      status: payment.attributes.status,
      currency: payment.attributes.currency,
      description: payment.attributes.description,
      donor_name: payment.attributes.billing?.name || 
                  payment.attributes.metadata?.donor_name || 
                  'Anonymous',
      donor_email: payment.attributes.billing?.email || 
                   payment.attributes.metadata?.donor_email || 
                   'N/A',
      payment_method: payment.attributes.source?.type || 
                      payment.attributes.payment_method_used || 
                      'Unknown',
      reference: payment.id,
      created_at: payment.attributes.created_at * 1000, 
    }));

    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Failed to fetch donations',
      details: error.response?.data?.errors || error.message
    });
  }
});

// Get donation statistics
app.get('/api/donations/stats', authenticateAdmin, async (req, res) => {
  try {
    const response = await axios.get(
      `${PAYMONGO_BASE_URL}/payments`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const payments = response.data.data;
    
    const stats = {
      total: payments.reduce((acc, p) => acc + p.attributes.amount, 0),
      count: payments.length,
      successful: payments.filter(p => p.attributes.status === 'paid').length,
      recent_total: payments
        .filter(p => new Date(p.attributes.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((acc, p) => acc + p.attributes.amount, 0),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ error: 'Failed to fetch donation statistics' });
  }
});

// Create payment source route
app.post('/api/create-payment-source', async (req, res) => {
  try {
    const { amount, type, currency, metadata } = req.body;

    const sourceData = {
      data: {
        attributes: {
          amount: Math.round(amount * 100), // Convert to centavos
          currency: currency,
          type: type,
          redirect: {
            success: `${process.env.FRONTEND_URL}/donate?status=success`,
            failed: `${process.env.FRONTEND_URL}/donate?status=failed`
          },
          billing: {
            name: metadata.donor_name,
            email: metadata.donor_email
          },
          metadata: metadata
        }
      }
    };

    const response = await axios.post(
      `${PAYMONGO_BASE_URL}/sources`,
      sourceData,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const source = response.data.data;
    res.json({
      id: source.id,
      status: source.attributes.status,
      redirect: {
        checkout_url: source.attributes.redirect.checkout_url
      }
    });
  } catch (error) {
    console.error('Error creating payment source:', error);
    res.status(500).json({ 
      error: 'Failed to create payment source',
      details: error.response?.data || error.message
    });
  }
});

// Add this new route after your existing routes
app.post('/api/create-payment-method', async (req, res) => {
  try {
    const { type, details, billing } = req.body;

    const response = await axios.post(
      `${PAYMONGO_BASE_URL}/payment_methods`,
      {
        data: {
          attributes: {
            type: type,
            details: details,
            billing: billing,
            metadata: {
              created_at: new Date().toISOString()
            }
          }
        }
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const paymentMethod = response.data.data;
    console.log('Payment Method Created:', paymentMethod);

    res.json({
      paymentMethodId: paymentMethod.id,
      type: paymentMethod.attributes.type,
      status: paymentMethod.attributes.status
    });

  } catch (error) {
    console.error('Payment Method Error:', error.response?.data || error);
    res.status(500).json({
      error: 'Failed to create payment method',
      details: error.response?.data?.errors || error.message
    });
  }
});

// Add this new route for sending thank you emails
app.post('/api/donations/:id/send-thank-you', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Retrieve the payment using axios
    const response = await axios.get(
      `${PAYMONGO_BASE_URL}/payments/${id}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const donation = response.data.data;

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const donorEmail = donation.attributes.billing?.email || 
                       donation.attributes.metadata?.donor_email;
    const donorName = donation.attributes.billing?.name || 
                      donation.attributes.metadata?.donor_name || 
                      'Valued Donor';
    const amount = donation.attributes.amount / 100; 

    if (!donorEmail || donorEmail === 'N/A') {
      return res.status(400).json({ error: 'No email address found for this donor' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donorEmail,
      subject: 'Thank You for Your Donation to IMMFI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">Thank You for Your Generous Donation!</h2>
          <p>Dear ${donorName},</p>
          <p>We are deeply grateful for your donation of ₱${amount.toLocaleString('en-PH')} to IMMFI. 
             Your generosity helps us continue our mission of supporting children with disabilities.</p>
          <p>Your contribution will make a real difference in:</p>
          <ul>
            <li>Providing essential therapy services</li>
            <li>Supporting educational programs</li>
            <li>Helping families access necessary resources</li>
          </ul>
          <p>Your donation reference number is: <strong>${donation.id}</strong></p>
          <p>If you have any questions or would like to learn more about how your donation helps, 
             please don't hesitate to contact us.</p>
          <p style="margin-top: 20px;">With gratitude,<br>The IMMFI Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Thank you email sent successfully' });
  } catch (error) {
    console.error('Error sending thank you email:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Failed to send thank you email',
      details: error.response?.data?.errors || error.message 
    });
  }
});

// Add this new route after your existing routes

app.post('/api/send-inquiry', async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Send email to IMMFI
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // This will send to IMMFI's email
      subject: `New Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">New Inquiry from Website Contact Form</h2>
          <p><strong>From:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This message was sent from the IMMFI website contact form.</p>
        </div>
      `
    };

    // Send confirmation email to the inquirer
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting IMMFI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">Thank You for Contacting IMMFI</h2>
          <p>Dear ${fullName},</p>
          <p>We have received your inquiry and will get back to you as soon as possible.</p>
          <p>Here's a copy of your message:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          <p>Best regards,<br>The IMMFI Team</p>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(confirmationMailOptions)
    ]);

    res.json({ message: 'Inquiry sent successfully' });
  } catch (error) {
    console.error('Error sending inquiry:', error);
    res.status(500).json({
      error: 'Failed to send inquiry',
      details: error.message
    });
  }
});

app.use('/api/gallery', galleryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});