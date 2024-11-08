var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  res.send(posts);
});

// 서버 코드 수정 (PUT 메서드 사용)
router.put('/like/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex !== -1) {
    // 좋아요 상태를 반전
    posts[postIndex].liked = !posts[postIndex].liked;

    // 변경된 게시물 반환
    res.status(200).json({
      message: '좋아요 상태가 성공적으로 변경되었습니다.',
      post: posts[postIndex],
    });
  } else {
    res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
  }
});

module.exports = router;
