var express = require('express');
var router = express.Router();

let posts = [
  {
    id: 1,
    title: '첫 번째 게시물',
    content: '이것은 첫 번째 게시물의 내용입니다.',
    image: '/images/post1.jpg',
    liked: false,
  },
  {
    id: 2,
    title: '두 번째 게시물',
    content: '이것은 두 번째 게시물의 내용입니다.',
    image: '/images/post2.jpg',
    liked: true,
  },
  {
    id: 3,
    title: '세 번째 게시물',
    content: '이것은 세 번째 게시물의 내용입니다.',
    image: '/images/post3.jpg',
    liked: false,
  },
];
/* GET users listing. */
router.get('/', function (res) {
  res.send(posts);
});

module.exports = router;
