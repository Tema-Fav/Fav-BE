const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboard');

router.get('/', async (req, res, next) => {
  try {
    const dashboards = await Dashboard.find();
    res.json(dashboards);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const dashboard = await Dashboard.findOne({ boss_id: id }).populate(
      'boss_id',
    ); // boss_id로 검색
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
