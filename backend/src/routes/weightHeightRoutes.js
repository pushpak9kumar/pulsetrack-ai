const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { handleWeightLog, getWeightHistory } = require('../controllers/weightHeightController');

router.post('/log', protect, handleWeightLog);
router.get('/history', protect, getWeightHistory);

module.exports = router;