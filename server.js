////////////////////////////////////////
// server/server.js
////////////////////////////////////////
/*
  Basic Express server with placeholder routes.
  In a real app, you'd:
   - Connect to PostgreSQL
   - Add user authentication (JWT)
   - Add product/checkout endpoints.
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g., "postgresql://user:pass@localhost:5432/mydb"
});

// Example route: fetch all products
app.get("/api/products", async (req, res) => {
  try {
    // In a real app, you'd do something like:
    // const { rows } = await pool.query('SELECT * FROM products');
    // For demonstration, return dummy data:
    const products = [
      {
        id: 1,
        title: "Sample Album 1",
        imageUrl: "https://via.placeholder.com/400x400",
        previewUrl: "/audio/album1-sample.mp3" // This can be a path to Google Cloud or local.
      },
      {
        id: 2,
        title: "Sample Album 2",
        imageUrl: "https://via.placeholder.com/400x400",
        previewUrl: "/audio/album2-sample.mp3"
      }
    ];

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});