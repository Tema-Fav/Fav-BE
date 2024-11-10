const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Store = require('../models/StoreInfo');

const FollowingSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoreInfo',
    required: true,
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

module.exports = mongoose.model('Following', FollowingSchema);
