const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Boss = require('../models/Boss');

// GET posts by bossId
router.get('/:bossId', async (req, res) => {
  const { bossId } = req.params;

  // Check if bossId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(bossId)) {
    return res.status(400).json({ error: '유효하지 않은 boss_id 형식입니다.' });
  }

  try {
    // Find posts with the given boss_id
    const posts = await Post.find({
      boss_id: new mongoose.Types.ObjectId(bossId),
    });

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ error: '해당 boss_id의 포스트를 찾을 수 없습니다.' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('데이터 조회 중 오류:', error);
    res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const { boss_id, content, is_open, crowd_level, created_at, updated_at } =
    req.body;

  if (!boss_id || !mongoose.Types.ObjectId.isValid(boss_id)) {
    return res.status(400).json({ error: 'Invalid or missing boss_id' });
  }

  try {
    const boss = await Boss.findById(boss_id);
    if (!boss) {
      return res.status(404).json({ error: 'Boss not found' });
    }

    const newPost = new Post({
      boss_id,
      content,
      is_open,
      crowd_level,
      created_at,
      updated_at,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/followed', async (req, res) => {
  const { storeIds } = req.query;

  try {
    if (!storeIds) {
      return res.status(400).json({ error: 'Store IDs are required' });
    }

    const storeIdArray = storeIds.split(',');
    const posts = await Post.find({ boss_id: { $in: storeIdArray } })
      .sort({ created_at: -1 })
      .populate('boss_id', 'store_name');

    if (posts.length === 0) {
      return res.status(404).json({ error: 'No posts found for these stores' });
    }

    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, is_open, crowd_level } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, is_open, crowd_level },
      { new: true, runValidators: true },
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
