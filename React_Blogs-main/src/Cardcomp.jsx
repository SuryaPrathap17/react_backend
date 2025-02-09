import React, { useState, useEffect } from "react";

// Custom Card Component
const Card = ({ children }) => {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      marginBottom: "16px",
      backgroundColor: "#fff",
    }}>
      {children}
    </div>
  );
};

// Custom Button Component
const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

const Cardcomp = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setBlogs([
        { id: 1, title: "First Blog", content: "This is the first blog post." },
        { id: 2, title: "Second Blog", content: "This is the second blog post." },
      ]);
    }, 1000);
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Blog App</h1>
      {blogs.length === 0 ? (
        <p>Loading...</p>
      ) : (
        blogs.map((blog) => (
          <Card key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <Button onClick={() => alert(`Reading ${blog.title}`)}>Read More</Button>
          </Card>
        ))
      )}
    </div>
  );
};

export default Cardcomp;
