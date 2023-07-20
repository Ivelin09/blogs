const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const upload = require('../middleware/uploadFile');
const authorize = require('../middleware/auth');

router.get('/blog/:id', blogController.getOne);
router.get('/blogs', blogController.getAll);
router.post('/blog', authorize, upload.single('image'), blogController.post)

module.exports = router;