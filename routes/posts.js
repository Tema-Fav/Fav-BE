const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Boss = require('../models/Boss');
const Following = require('../models/Following');
const Store = require('../models/StoreInfo');

// Get posts from followed stores
router.get('/followed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching posts for user:', userId);

    // Find stores that the user is following
    const followedStores = await Following.find({ id: userId }).distinct(
      'store_id',
    );
    console.log('Followed stores:', followedStores);

    // Find boss IDs corresponding to the followed stores
    const stores = await Store.find({ _id: { $in: followedStores } });
    const bossIds = stores.map((store) => store.boss_id);
    console.log('Boss IDs:', bossIds);

    // Fetch posts from followed stores' bosses
    const posts = await Post.find({ boss_id: { $in: bossIds } }).sort({
      created_at: -1,
    });

    console.log('가져온 게시물:', JSON.stringify(posts, null, 2));

    // Format the posts
    let formattedPosts = posts.map((post) => ({
      _id: post._id.toString(),
      content: post.content,
      created_at: post.created_at,
      is_open: post.is_open,
      crowd_level: post.crowd_level,
      boss_id: post.boss_id.toString(),
    }));

    // Fetch store info for each post and add it to the formatted posts
    formattedPosts = await Promise.all(
      formattedPosts.map(async (post) => {
        const storeInfo = await Store.findOne({ boss_id: post.boss_id });
        return {
          ...post,
          store_name: storeInfo ? storeInfo.store_name : '알 수 없는 가게',
          photo: storeInfo ? storeInfo.store_photo : null,
        };
      }),
    );

    console.log('보내는 응답:', JSON.stringify(formattedPosts, null, 2));
    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error('Error fetching followed posts:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
});

// GET posts by bossId
router.get('/:bossId', async (req, res) => {
  const { bossId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bossId)) {
    return res.status(400).json({ error: '유효하지 않은 boss_id 형식입니다.' });
  }

  try {
    const posts = await Post.find({
      boss_id: new mongoose.Types.ObjectId(bossId),
    }).sort({ created_at: -1 });

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
  const { boss_id, content, is_open, crowd_level, store_name, store_photo } =
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
      store_name,
      store_photo,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('포스트 생성 중 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a post by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, is_open, crowd_level, store_name, store_photo } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        content,
        is_open,
        crowd_level,
        store_name,
        store_photo,
        updated_at: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('포스트 업데이트 중 오류:', error);
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
    console.error('포스트 삭제 중 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
