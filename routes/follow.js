const express = require('express');
const router = express.Router();
const Following = require('../models/Following');

router.post('/', async (req, res) => {
  try {
    const { userId, storeId } = req.body;

    console.log('Follow request received:', { userId, storeId });

    if (!userId || !storeId) {
      return res
        .status(400)
        .json({ success: false, message: 'User ID and Store ID are required' });
    }

    // Check if already following
    const existingFollow = await Following.findOne({
      id: userId,
      store_id: storeId,
    });

    if (existingFollow) {
      // If already following, unfollow
      await Following.findByIdAndDelete(existingFollow._id);
      console.log('User unfollowed store:', { userId, storeId });
      res.json({ success: true, message: 'Unfollowed successfully' });
    } else {
      // If not following, create new follow
      const newFollow = new Following({
        id: userId,
        store_id: storeId,
      });
      await newFollow.save();
      console.log('User followed store:', { userId, storeId });
      res.json({ success: true, message: 'Followed successfully' });
    }
  } catch (error) {
    console.error('Error in follow/unfollow:', error);
    if (error.code === 11000) {
      // Duplicate key error
      res
        .status(409)
        .json({ success: false, message: 'Already following this store' });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
});

router.get('/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;

    console.log('Fetching followers for store:', storeId);

    if (!storeId) {
      return res
        .status(400)
        .json({ success: false, message: 'Store ID is required' });
    }

    // Find all followers of the specified store
    const followers = await Following.find({ store_id: storeId }, 'id'); // Only select `id` field (userId)

    // Extract and return the user IDs
    const followerIds = followers.map((follow) => follow.id);

    return res.json({ success: true, followers: followerIds });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

module.exports = router;
