const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
const Guest = require('../models/Guest');
const Boss = require('../models/Boss');
const { createToken } = require('../utils/auth');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await Guest.findOne({ email });
    let role = 'guest';

    if (!user) {
      user = await Boss.findOne({ email });
      role = 'boss';
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = createToken({ _id: user._id, email: user.email, role });
      return res.status(200).json({ token, role });
    }

    throw Error('정확하지 않은 이메일이나 비밀번호입니다.');
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
