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
