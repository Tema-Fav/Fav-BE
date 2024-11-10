const express = require('express');
const router = express.Router();
const Following = require('../models/Following');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Received token:', token); // Add this line
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err); // Add this line
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded._id;
    console.log('Decoded user ID:', req.userId); // Add this line
    next();
  });
};

router.post('/follow', verifyToken, async (req, res) => {
  try {
    const { storeId } = req.body;
    const userId = req.userId;

    console.log('Follow request received:', { userId, storeId }); // Add this line

    if (!storeId) {
      return res.status(400).json({ message: 'Store ID is required' });
    }

    // Check if already following
    const existingFollow = await Following.findOne({
      id: userId,
      store_id: storeId,
    });
    if (existingFollow) {
      // If already following, unfollow
      await Following.findByIdAndDelete(existingFollow._id);
      console.log('User unfollowed store:', { userId, storeId }); // Add this line
      res.json({ message: 'Unfollowed successfully' });
    } else {
      // If not following, create new follow
      const newFollow = new Following({
        id: userId,
        store_id: storeId,
      });
      await newFollow.save();
      console.log('User followed store:', { userId, storeId }); // Add this line
      res.json({ message: 'Followed successfully' });
    }
  } catch (error) {
    console.error('Error in follow/unfollow:', error);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
