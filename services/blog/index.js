import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI_BLOG);

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

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

// Routes
app.post('/api/blogs', verifyToken, async (req, res) => {
  try {
    const { title, content, imageUrl, category, location } = req.body;
    const blog = new Blog({
      title,
      content,
      imageUrl,
      category,
      location,
      author: req.userId
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'all' ? { category } : {};
    const blogs = await Blog.find(query).populate('author', 'name');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

app.put('/api/blogs/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.userId });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }
    
    Object.assign(blog, req.body);
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
});

app.delete('/api/blogs/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
});

const PORT = process.env.BLOG_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Blog service running on port ${PORT}`);
});