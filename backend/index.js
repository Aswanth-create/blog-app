const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./models/routes/userRoutes.js'); // ✅ Adjust path as per your folder structure

dotenv.config(); // Load .env variables

const app = express();

// MIDDLEWARES
app.use(express.json()); // ✅ Parse JSON body
app.use(cors());         // ✅ Handle CORS

// ROUTES
app.use('/api/users', userRoutes);
console.log("✅ userRoutes mounted at /api/users");
 // ✅ All user-related routes go here

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

