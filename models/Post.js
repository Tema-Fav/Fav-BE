const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');
const Boss = require('../models/Boss');

const postSchema = new mongoose.Schema(
  {
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
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
  },
  {
    timestamps: true, // created_at과 updated_at 자동 관리
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual field 설정
postSchema.virtual('store', {
  ref: 'Store',
  localField: 'store_id',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Post', postSchema);
