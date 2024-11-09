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

router.get('/search', async (req, res) => {
  const searchText = req.query.q;
  console.log('>>>>>', searchText);

  if (!searchText || searchText.trim() === '') {
    return res.status(400).json({ error: '검색어를 입력해주세요.' });
  }

  try {
    const results = await StoreInfo.find({
      store_name: { $regex: searchText, $options: 'i' },
    });

    if (results.length === 0) {
      return res.status(404).json({ message: '검색 결과가 없습니다.' });
    }

    res.json(results);
  } catch (error) {
    console.error('검색 중 오류가 발생했습니다:', error.stack || error);
    res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const storeInfo = await StoreInfo.findOne({ boss_id: id }).populate(
      'boss_id',
    ); // boss_id로 검색
    if (!storeInfo) {
      return res.status(404).json({ error: 'StoreInfo not found' });
    }
    res.status(200).json(storeInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res, next) => {
  const { store_name, store_address, store_info, store_photo, boss_id } =
    req.body;

  try {
    // 스키마에 맞는 필드로 데이터를 생성합니다.
    const newStoreInfo = new StoreInfo({
      store_name,
      store_address,
      store_info,
      store_photo,
      boss_id,
    });
    const savedStoreInfo = await newStoreInfo.save();
    res.status(201).json(savedStoreInfo);
  } catch (error) {
    console.error('데이터 생성 중 오류:', error);
    res.status(500).json({ error: '데이터 생성 중 오류가 발생했습니다.' });
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { store_name, store_address, store_info, store_photo } = req.body;

  try {
    const updatedStoreInfo = await StoreInfo.findOneAndUpdate(
      { boss_id: id },
      { store_name, store_address, store_info, store_photo },
      { new: true, runValidators: true },
    );

    if (!updatedStoreInfo) {
      return res.status(404).json({ error: 'StoreInfo not found' });
    }

    res.status(200).json(updatedStoreInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedStoreInfo = await StoreInfo.findOneAndDelete({ boss_id: id });

    if (!deletedStoreInfo) {
      return res.status(404).json({ error: 'StoreInfo not found' });
    }

    res.status(200).json({ message: 'StoreInfo successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
