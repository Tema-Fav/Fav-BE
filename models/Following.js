const mongoose = require('mongoose');

const FollowingSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true,
  },
  store_id: {
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
