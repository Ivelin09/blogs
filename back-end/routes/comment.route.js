const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');
const commentController = require('../controllers/comment');

router.post('/comment', authorize, commentController.post);
router.delete('/comment/:id', authorize, commentController.delete);
router.get('/reply/:commentId', commentController.getOne);
router.get('/comments/:blogId', commentController.getAll);

module.exports = router;