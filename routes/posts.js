const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Boss = require('../models/Boss');

router.get('/', async (req, res) => {
  const { user_id } = req.query;

  try {
    if (user_id) {
      const posts = await Post.find({ author_id: user_id });

      if (posts.length === 0) {
        return res.status(404).json({ error: 'No posts found for this user' });
      }

      return res.status(200).json(posts); // 해당 user의 포스트들 반환
    } else {
      // user_id가 제공되지 않으면 모든 포스트 조회
      const posts = await Post.find();
      res.status(200).json(posts); // 모든 포스트 반환
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 포스트 생성하기
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

// 포스트 수정하기 (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, is_open, crowd_level } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, is_open, crowd_level },
      { new: true, runValidators: true }, // updated document 반환
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 포스트 삭제하기 (DELETE)
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
