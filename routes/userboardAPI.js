var express = require('express');
var router = express.Router();
let posts = [
  {
    id: 1,
    title: '첫 번째 게시시물',
    content:
      '이것은 첫 번째 게시물의 내용입니다. 추가된 내용: 게시물이 처음으로 게시되었습니다.',
    image: '/images/post1.jpg',
    liked: false,
  },
  {
    id: 2,
    title: '두 번째 게시물',
    content:
      '이것은 두 번째 게시물의 내용입니다. 추가된 내용: 이번 게시물은 많은 관심을 받았습니다.',
    image: '/images/post2.jpg',
    liked: false,
  },
  {
    id: 3,
    title: '세 번째 게시물',
    content:
      '이것은 세 번째 게시물의 내용입니다. 추가된 내용: 게시물이 계속해서 흥미롭습니다.',
    image: '/images/post3.jpg',
    liked: false,
  },
  {
    id: 4,
    title: '네 번째 게시물',
    content:
      '이것은 네 번째 게시물의 내용입니다. 추가된 내용: 게시물이 주목받고 있습니다.',
    image: '/images/post4.jpg',
    liked: false,
  },
  {
    id: 5,
    title: '다섯 번째 게시물',
    content:
      '이것은 다섯 번째 게시물의 내용입니다. 추가된 내용: 매우 유익한 정보가 포함되어 있습니다.',
    image: '/images/post5.jpg',
    liked: false,
  },
  {
    id: 6,
    title: '여섯 번째 게시물',
    content:
      '이것은 여섯 번째 게시물의 내용입니다. 추가된 내용: 새로운 내용이 추가되었습니다.',
    image: '/images/post6.jpg',
    liked: false,
  },
  {
    id: 7,
    title: '일곱 번째 게시물',
    content:
      '이것은 일곱 번째 게시물의 내용입니다. 추가된 내용: 더 많은 게시물이 예정되어 있습니다.',
    image: '/images/post7.jpg',
    liked: false,
  },
  {
    id: 8,
    title: '여덟 번째 게시물',
    content:
      '이것은 여덟 번째 게시물의 내용입니다. 추가된 내용: 이 게시물도 관심을 받고 있습니다.',
    image: '/images/post8.jpg',
    liked: false,
  },
  {
    id: 9,
    title: '아홉 번째 게시물',
    content:
      '이것은 아홉 번째 게시물의 내용입니다. 추가된 내용: 내용이 더욱 풍부해졌습니다.',
    image: '/images/post9.jpg',
    liked: false,
  },
  {
    id: 10,
    title: '열 번째 게시물',
    content:
      '이것은 열 번째 게시물의 내용입니다. 추가된 내용: 게시물이 성공적으로 마무리되었습니다.',
    image: '/images/post10.jpg',
    liked: false,
  },
  {
    id: 11,
    title: '열한 번째 게시물',
    content:
      '이것은 열한 번째 게시물의 내용입니다. 추가된 내용: 내용이 업데이트되었습니다.',
    image: '/images/post11.jpg',
    liked: false,
  },
  {
    id: 12,
    title: '열두 번째 게시물',
    content:
      '이것은 열두 번째 게시물의 내용입니다. 추가된 내용: 더 많은 사람들이 이 게시물을 보고 있습니다.',
    image: '/images/post12.jpg',
    liked: false,
  },
  {
    id: 13,
    title: '열세 번째 게시물',
    content:
      '이것은 열세 번째 게시물의 내용입니다. 추가된 내용: 새로운 업데이트가 포함되었습니다.',
    image: '/images/post13.jpg',
    liked: false,
  },
  {
    id: 14,
    title: '열네 번째 게시물',
    content:
      '이것은 열네 번째 게시물의 내용입니다. 추가된 내용: 많은 피드백을 받았습니다.',
    image: '/images/post14.jpg',
    liked: false,
  },
  {
    id: 15,
    title: '열다섯 번째 게시물',
    content:
      '이것은 열다섯 번째 게시물의 내용입니다. 추가된 내용: 매우 유익한 내용이 담겨 있습니다.',
    image: '/images/post15.jpg',
    liked: false,
  },
  {
    id: 16,
    title: '열여섯 번째 게시물',
    content:
      '이것은 열여섯 번째 게시물의 내용입니다. 추가된 내용: 게시물의 질이 향상되었습니다.',
    image: '/images/post16.jpg',
    liked: false,
  },
  {
    id: 17,
    title: '열일곱 번째 게시물',
    content:
      '이것은 열일곱 번째 게시물의 내용입니다. 추가된 내용: 더 나은 내용을 추가하려고 합니다.',
    image: '/images/post17.jpg',
    liked: false,
  },
  {
    id: 18,
    title: '열여덟 번째 게시물',
    content:
      '이것은 열여덟 번째 게시물의 내용입니다. 추가된 내용: 이 게시물은 많은 인기를 끌고 있습니다.',
    image: '/images/post18.jpg',
    liked: false,
  },
  {
    id: 19,
    title: '열아홉 번째 게시물',
    content:
      '이것은 열아홉 번째 게시물의 내용입니다. 추가된 내용: 지속적으로 업데이트되고 있습니다.',
    image: '/images/post19.jpg',
    liked: false,
  },
  {
    id: 20,
    title: '스무 번째 게시물',
    content:
      '이것은 스무 번째 게시물의 내용입니다. 추가된 내용: 이 게시물이 마지막으로 올라갔습니다.',
    image: '/images/post20.jpg',
    liked: false,
  },
];
/* GET users listing. */
router.get('/', function (req, res) {
  res.send(posts);
});

module.exports = router;
