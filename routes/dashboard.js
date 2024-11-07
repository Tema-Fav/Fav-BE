// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboard');

router.get('/', async (req, res, next) => {
  try {
    const dashboard = await Dashboard.find();
    res.json(dashboard);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    res.json(dashboard);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res) => {
  const { name, follow_num } = req.body;
  Dashboard.create({
    name,
    follow_num,
  }).then((data) => {
    res.json(data);
  });
});

module.exports = router;
