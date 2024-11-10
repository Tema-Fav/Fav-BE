var express = require('express');
const Guest = require('../models/Guest');

var router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, nickname, name } = req.body;
    console.log(req.body);
    const guest = await Guest.signUp(email, password, nickname, name);
    res.status(201).json(guest);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

module.exports = router;
