import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI_MEDIA);

// Media Schema
const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: true }
});

const Media = mongoose.model('Media', mediaSchema);

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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

// Ensure uploads directory exists
const ensureUploadsDirectory = async () => {
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads');
  }
};

ensureUploadsDirectory();

// Routes
app.post('/api/media/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      uploadedBy: req.userId
    });

    await media.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        url: fileUrl,
        id: media._id,
        name: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message
    });
  }
});

app.delete('/api/media/:id', verifyToken, async (req, res) => {
  try {
    const media = await Media.findOne({
      _id: req.params.id,
      uploadedBy: req.userId
    });

    if (!media) {
      return res.status(404).json({ message: 'Media not found or unauthorized' });
    }

    // Delete file from filesystem
    const filePath = path.join('uploads', media.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('File deletion error:', error);
      // Continue even if file doesn't exist
    }

    // Delete from database
    await Media.deleteOne({ _id: req.params.id });

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      message: 'Error deleting media',
      error: error.message
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      message: 'File upload error',
      error: error.message
    });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      message: error.message
    });
  }

  console.error('Server error:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: error.message
  });
});

const PORT = process.env.MEDIA_SERVICE_PORT || 3004;
app.listen(PORT, () => {
  console.log(`Media service running on port ${PORT}`);
});