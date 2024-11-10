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

      // 역할과 첫 로그인 여부에 따른 리다이렉트 경로 설ㅈ어
      let redirectPath;
      if (role === 'guest') {
        redirectPath = '/userboard';
      } else {
        // 사장님은 첫 로그인 시 /storeinfo, 이후에는 /dashboard로 이동
        redirectPath = user.isFirstLogin ? '/storeinfo' : '/dashboard';

        // 첫 로그인 시 isFirstLogin을 false로 업데이트
        if (user.isFirstLogin) {
          user.isFirstLogin = false;
          await user.save();
        }
      }
      return res.status(200).json({ token, role, redirectPath });
    }

    throw Error('정확하지 않은 이메일이나 비밀번호입니다.');
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
