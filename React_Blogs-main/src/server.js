import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

const sequelize = new Sequelize('blogdb', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});


const Blog = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'blogs', 
  timestamps: true,   
  createdAt: 'created_at', 
  updatedAt: 'updated_at',
});


sequelize.sync()
  .then(() => console.log('✅ Connected to MySQL Database and synced models'))
  .catch(err => console.error('Database connection failed:', err));


app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/blogs', async (req, res) => {
  const { title, image, content } = req.body;
  try {
    const newBlog = await Blog.create({ title, image, content });
    res.json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    await blog.destroy();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
