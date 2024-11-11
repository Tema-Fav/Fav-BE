var express = require('express');
const Guest = require('../models/Guest');

var router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, nickname, name } = req.body;
    console.log(req.body);
    const guest = await Guest.signUp(email, password, nickname, name);
    res.status(201).json(guest);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

// New GET endpoint to retrieve multiple usernames by user IDs
router.get('/usernames', async (req, res) => {
  try {
    // Expect user IDs as a comma-separated string in query params
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'User IDs are required',
      });
    }

    const userIds = ids.split(','); // Convert the comma-separated string to an array

    console.log('Fetching usernames for user IDs:', userIds);

    // Find users by their IDs and retrieve only the nickname field
    const users = await Guest.find({ _id: { $in: userIds } }, 'nickname');

    const usernames = users.map((user) => ({
      id: user._id,
      nickname: user.nickname,
    }));

    return res.json({ success: true, usernames });
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// GET endpoint to retrieve a single username by user ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    console.log('Fetching username for user ID:', id);

    // Find the user's nickname by their ID
    const user = await Guest.findById(id, 'nickname');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({ success: true, username: user.nickname });
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

module.exports = router;
