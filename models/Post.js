const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');
const Boss = require('../models/Boss');

const postSchema = new mongoose.Schema({
  boss_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boss',
    required: true,
  },
  content: {
    type: String,
    maxlength: 600,
  },
  is_open: {
    type: Boolean,
    default: true,
  },
  crowd_level: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

postSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Post', postSchema);

router.post('/', async (req, res) => {
  const { boss_id, content, is_open, crowd_level } = req.body;

  // boss_id 유효성 검사
  if (!mongoose.Types.ObjectId.isValid(boss_id)) {
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

module.exports = mongoose.model('Post', postSchema);
