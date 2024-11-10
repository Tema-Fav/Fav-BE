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
      const token = createToken({
        _id: user._id,
        email: user.email,
        name: user.name,
        role,
      });

      // 역할과 첫 로그인 여부에 따른 리다이렉트 경로 설정
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

      // 클라이언트에서 접근 가능한 쿠키 설정 (토큰을 쿠키에 저장)
      res.cookie('authToken', token, {
        maxAge: 60 * 60 * 24 * 3 * 1000, // 3일
        httpOnly: false, // 클라이언트에서 접근할 수 있도록 설정
        secure: false, // 프로덕션 환경에서만 secure 설정
        sameSite: 'Lax', // CSRF 보호를 위한 설정
      });

      return res.status(200).json({ role, redirectPath });
    }

    throw Error('정확하지 않은 이메일이나 비밀번호입니다.');
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
