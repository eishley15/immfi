const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BlogPost = require('../models/BlogPost');
const { authenticateAdmin } = require('../middleware/auth');

// Define upload directory path
const uploadDir = 'public/images/gallery-images';

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created upload directory:', uploadDir);
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Get all blog posts (public)
router.get('/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ date: -1 });
    console.log('Found posts:', posts); // Debug log
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching blog posts' });
  }
});

// Get single blog post by ID (public)
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Error fetching blog post' });
  }
});

// Create new blog post (admin only)
router.post('/posts', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, createdBy } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imageUrl = `/images/gallery-images/${req.file.filename}`;
    
    const newPost = new BlogPost({
      title,
      description,
      subtitle,
      imageUrl,
      createdBy
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Error creating blog post' });
  }
});

// Delete blog post (admin only)
router.delete('/posts/:id', authenticateAdmin, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting blog post' });
  }
});

// Edit blog post (admin only)
router.put('/posts/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = {
      title,
      description,
      subtitle,
      lastModified: new Date()
    };

    // If a new image is uploaded, update the image URL
    if (req.file) {
      // Delete old image if it exists
      const oldPost = await BlogPost.findById(req.params.id);
      if (oldPost && oldPost.imageUrl) {
        const oldImagePath = path.join(__dirname, '../public', oldPost.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imageUrl = `/images/gallery-images/${req.file.filename}`;
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Error updating blog post' });
  }
});

module.exports = router;