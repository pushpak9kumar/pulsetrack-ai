const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getGoal, updateGoal, getGoalHistory } = require('../controllers/goalController');

router.get('/goal', protect, getGoal);
router.put('/goal', protect, updateGoal);
router.get('/goal/history', protect, getGoalHistory);

module.exports = router;