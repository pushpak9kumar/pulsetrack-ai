const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAICoachFeedback, chatWithAI } = require('../controllers/aiController');


//Post /api/ai/coach - AI se feedback lo
router.post('/coach', protect, getAICoachFeedback);
router.post('/chat-coach', protect, chatWithAI);

module.exports = router;