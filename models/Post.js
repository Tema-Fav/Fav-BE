const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  crowd_level: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  is_open: { type: Boolean, required: true },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
