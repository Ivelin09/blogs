const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.post('/register', usersController.post);

module.exports = router;