import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Home Component
const Home = () => (
  <div className="p-4 max-w-2xl mx-auto text-left">
    <h1 className="text-3xl font-bold mb-4">Welcome to Surya's Blogging Website</h1>
    <p className="text-lg mb-4">Share your thoughts, read amazing blogs, and connect with others.</p>
    <Link className="bg-gray-500 text-white px-4 py-2 rounded" to="/create">Create Your First Blog</Link>
  </div>
);

// Blog List Component
const BlogList = ({ blogs, deleteBlog }) => (
  <div className="p-4 max-w-4xl mx-auto text-left">
    <h1 className="text-3xl font-bold mb-6 text-center">Recent Blogs</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white border rounded-lg shadow-lg overflow-hidden">
          <img src={blog.image} alt="Blog" className="w-full h-48 object-cover" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="text-gray-700">{blog.content.substring(0, 100)}...</p>
            <div className="flex justify-between mt-3">
              <Link to={`/blog/${blog.id}`} className="text-blue-500">Read More</Link>
              <button className="text-red-500" onClick={() => deleteBlog(blog.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Create Blog Component
const CreateBlog = ({ addBlog, title, setTitle, image, setImage, content, setContent }) => (
  <div className="p-4 max-w-2xl mx-auto text-left">
    <h1 className="text-3xl font-bold mb-6">Create a New Blog</h1>
    <input className="border p-2 mb-4 w-full" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog Title" />
    <input className="border p-2 mb-4 w-full" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
    <textarea className="border p-2 mb-4 w-full" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Blog Content" />
    <button className="bg-blue-500 text-white px-6 py-2 rounded" onClick={addBlog}>Add Blog</button>
  </div>
);

// View Blog Component
const ViewBlog = ({ blogs }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id == id);

  if (!blog) return <div className="text-center mt-10">Blog not found</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto text-left">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <img src={blog.image} alt="Blog" className="w-full h-60 object-cover mt-4" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
      <p className="mt-4">{blog.content}</p>
    </div>
  );
};

// Header Component
const Header = () => (
  <nav className="bg-gray-800 p-4 fixed top-0 left-0 w-full shadow-md">
    <ul className="flex justify-center space-x-6">
      <li><Link className="text-white hover:text-gray-300" to="/">Home</Link></li>
      <li><Link className="text-white hover:text-gray-300" to="/blogs">Blogs</Link></li>
      <li><Link className="text-white hover:text-gray-300" to="/create">Create Blog</Link></li>
    </ul>
  </nav>
);

const BlogApp = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const addBlog = () => {
    if (!title || !content) {
      toast.error("Title and Content are required!");
      return;
    }

    const newBlog = {
      title,
      image: image || "https://via.placeholder.com/150",
      content,
    };

    fetch("http://localhost:5000/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlog),
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogs([data, ...blogs]);
        setTitle("");
        setImage("");
        setContent("");
        toast.success("Blog added successfully!");
      })
      .catch((err) => console.error("Error adding blog:", err));
  };

  const deleteBlog = (id) => {
    fetch(`http://localhost:5000/api/blogs/${id}`, { method: "DELETE" })
      .then(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id));
        toast.error("Blog deleted successfully!");
      })
      .catch((err) => console.error("Error deleting blog:", err));
  };

  return (
    <Router>
      <Header />
      <div className="mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<BlogList blogs={blogs} deleteBlog={deleteBlog} />} />
          <Route path="/create" element={<CreateBlog addBlog={addBlog} title={title} setTitle={setTitle} image={image} setImage={setImage} content={content} setContent={setContent} />} />
          <Route path="/blog/:id" element={<ViewBlog blogs={blogs} />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default BlogApp;
