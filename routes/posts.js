const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Boss = require('../models/Boss');

// 전체 조회 핸들러
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find(); // 모든 Post 데이터 조회
    res.status(200).json(posts); // JSON 형식으로 응답
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 포스트 생성하기
router.post('/', async (req, res) => {
  const { boss_id, content, is_open, crowd_level } = req.body;

  // 요청 바디 출력
  console.log('Request Body:', req.body);

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
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
