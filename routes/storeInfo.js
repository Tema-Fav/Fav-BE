const express = require('express');
const router = express.Router();
const StoreInfo = require('../models/StoreInfo');

router.get('/', async (req, res, next) => {
  try {
    const storeInfos = await StoreInfo.find();
    res.json(storeInfos);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const storeInfo = await StoreInfo.findById(req.params.id);
    if (!storeInfo) {
      return res.status(404).json({ error: 'StoreInfo not found' });
    }
    res.json(storeInfo);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res) => {
  const { store_name, store_address, store_phone, boss_name, store_photo } =
    req.body;
  StoreInfo.create({
    store_name,
    store_address,
    store_info,
    store_photo,
  }).then((data) => {
    res.json(data);
  });
});

router.put('/:id', (req, res) => {
  StoreInfo.findByIdAndUpdate(req.params.id, {
    store_name: req.body.store_name,
    store_address: req.body.store_address,
    sotre_info: req.body.store_info,
    store_photo: req.body.store_photo,
  }).then((result) => {
    res.json(result);
  });
});

router.delete('/:id', async (req, res, next) => {
  try {
    const storeInfo = await StoreInfo.findByIdAndDelete(req.params.id);
    if (!storeInfo) {
      return res.status(404).json({ error: 'StoreInfo not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get('/search', async (req, res) => {
  const searchText = req.query.q;

  if (!searchText) {
    return res.status(400).json({ error: '검색어를 입력해주세요.' });
  }

  try {
    // $regex를 사용하여 name 필드에 검색어가 포함된 가게 검색
    const results = await StoreInfo.find({
      store_name: { $regex: searchText, $options: 'i' },
    });
    res.json(results);
  } catch (error) {
    console.error('검색 중 오류가 발생했습니다.', error);
    res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
