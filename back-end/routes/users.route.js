const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const authorize = require('../middleware/auth');
const upload = require('../middleware/uploadFile');

router.post('/register', usersController.post);
router.get('/authorize', authorize, usersController.get);
router.get('/onlineUsers', usersController.getAllOnlineUsers);
router.get('/profile', authorize, usersController.profileData);
router.get('/profile/:username', usersController.otherProfileData);
router.patch('/profilePicutre', authorize, upload.single('image'), usersController.changeProfile);
module.exports = router;