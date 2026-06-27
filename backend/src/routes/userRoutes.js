const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserStats, getGoal, updateGoal } = require('../controllers/userController');

//Get /api/users/stats - User apna progress dekhe
router.get('/stats', protect, getUserStats);
router.get('/goal', protect, getGoal);
router.put('/goal', protect, updateGoal);


module.exports = router;