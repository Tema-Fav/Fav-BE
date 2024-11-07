var express = require('express');
const Boss = require('../models/Boss');

var router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, address, name } = req.body;
    console.log(req.body);
    const guest = await Boss.signUp(email, password, address, name);
    res.status(201).json(guest);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

module.exports = router;
