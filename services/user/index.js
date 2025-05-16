import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI_USER);

// User Profile Schema
const profileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2
  },
  profilePicture: { 
    type: String,
    default: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop'
  },
  bio: { 
    type: String,
    maxlength: 500
  },
  location: String,
  socialLinks: {
    twitter: String,
    instagram: String,
    facebook: String
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Input validation middleware
const validateProfileUpdate = (req, res, next) => {
  const { name, bio } = req.body;
  const errors = {};

  if (name && name.length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  if (bio && bio.length > 500) {
    errors.bio = 'Bio must not exceed 500 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Routes
app.post('/api/profiles', verifyToken, async (req, res) => {
  try {
    const { name, profilePicture, bio, location, socialLinks } = req.body;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId: req.userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = new Profile({
      userId: req.userId,
      name,
      profilePicture,
      bio,
      location,
      socialLinks
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating profile', 
      error: error.message 
    });
  }
});

// Get own profile
app.get('/api/profiles/me', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Get user's blogs
    const blogsResponse = await fetch(
      `${process.env.BLOG_SERVICE_URL}/api/blogs/user/${req.userId}`
    );
    const blogs = await blogsResponse.json();

    res.json({
      profile,
      blogs
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
});

// Get profile by userId
app.get('/api/profiles/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
});

// Update profile
app.put('/api/profiles/me', verifyToken, validateProfileUpdate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    const allowedUpdates = [
      'name', 
      'profilePicture', 
      'bio', 
      'location', 
      'socialLinks',
      'preferences'
    ];
    
    // Only update allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();
    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
});

// Delete profile (for account deletion)
app.delete('/api/profiles/me', verifyToken, async (req, res) => {
  try {
    const result = await Profile.deleteOne({ userId: req.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting profile', 
      error: error.message 
    });
  }
});

const PORT = process.env.USER_SERVICE_PORT || 3003;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});