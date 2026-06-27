const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { handleWeightLog } = require('../controllers/weightHeightController');

router.post('/log', protect, handleWeightLog);

module.exports = router;