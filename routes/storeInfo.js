const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const StoreInfo = require('../models/StoreInfo');

// multer 설정: 파일을 'uploads/' 폴더에 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 파일이 저장될 폴더
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // 파일 이름 설정
  },
});

const upload = multer({ storage: storage });

// 전체 상점 정보 조회
router.get('/', async (req, res, next) => {
  try {
    const storeInfos = await StoreInfo.find();
    res.json(storeInfos);
  } catch (err) {
    next(err);
  }
});

// 상점 검색
router.get('/search', async (req, res) => {
  const searchText = req.query.q;
  console.log('검색어:', searchText);

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

// 특정 boss_id로 상점 조회
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(`boss_id로 상점 조회 시도: ${id}`);

  try {
    const storeInfo = await StoreInfo.findOne({ boss_id: id });

    if (!storeInfo) {
      console.log('StoreInfo not found');
      return res.status(404).json({ error: 'StoreInfo not found' });
    }

    console.log('StoreInfo found:', storeInfo);
    res.status(200).json(storeInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id', upload.single('store_photo'), async (req, res, next) => {
  // params에서 boss_id 추출
  const { id: boss_id } = req.params;
  const { store_name, store_address, store_info } = req.body;
  const store_photo = req.file ? req.file.path : null;

  try {
    const newStoreInfo = new StoreInfo({
      store_name,
      store_address,
      store_info,
      store_photo,
      boss_id, // 수정된 부분
    });
    const savedStoreInfo = await newStoreInfo.save();
    res.status(201).json(savedStoreInfo);
  } catch (error) {
    console.error('데이터 생성 중 오류:', error);
    res.status(500).json({ error: '데이터 생성 중 오류가 발생했습니다.' });
  }
});

// 상점 정보 수정
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

// 상점 삭제
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
