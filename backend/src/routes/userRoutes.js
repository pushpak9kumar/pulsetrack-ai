const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserStats, getUserGoal, updateUserGoal, getGoalHistory } = require('../controllers/userController');

//Get /api/users/stats - User apna progress dekhe
router.get('/stats', protect, getUserStats);
router.get('/goal', protect, getUserGoal);
router.put('/goal', protect, updateUserGoal);
router.get('/goal/history', protect, getGoalHistory);

module.exports = router;