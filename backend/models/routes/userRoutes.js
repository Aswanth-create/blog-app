const express = require('express');
const router = express.Router();
const User = require('../User'); // ✅ Ensured correct path (lowercase)

// @desc    Register user
// @route   POST /api/users/register
router.post('/register', async (req, res) => {
  console.log('📬 Registration request received'); // Debug log
  
  try {
    // 1. Input Validation
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email and password are required' 
      });
    }

    // 2. Check for existing user (case-insensitive)
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: 'Email already registered' 
      });
    }

    // 3. Create and save user
    const newUser = new User({ 
      name, 
      email: email.toLowerCase(), // Normalize email
      password 
    });

    await newUser.save();

    // 4. Success response (exclude password)
    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('🔥 Registration error:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});
// @route   POST /api/users/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;