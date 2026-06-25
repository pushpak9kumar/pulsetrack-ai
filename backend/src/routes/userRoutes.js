const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserStats } = require('../controllers/userController');

//Get /api/users/stats - User apna progress dekhe
router.get('/stats', protect, getUserStats);

module.exports = router;