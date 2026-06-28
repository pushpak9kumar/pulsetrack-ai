const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile, uploadAvatar } = require('../controllers/profileController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getUserProfile);
router.put('/', protect, updateUserProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;