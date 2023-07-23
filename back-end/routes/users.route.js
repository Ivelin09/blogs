const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const authorize = require('../middleware/auth');

router.post('/register', usersController.post);
router.get('/authorize', authorize, usersController.get);

module.exports = router;