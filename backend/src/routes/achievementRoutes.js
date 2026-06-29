/*const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAchievements, checkNewAchievements } = require('../controllers/achievementController');

router.get('/', protect, getAchievements);
router.post('/check', protect, checkNewAchievements);

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAchievements, checkNewAchievements, checkAndUnlockBadges } = require('../controllers/achievementController');

router.get('/', protect, getAchievements);
router.post('/check', protect, checkNewAchievements);

// ✅ YE NAYA TEST ROUTE ADD KAR
router.post('/test-manual', protect, async (req, res) => {
    try {
        console.log('🧪 Manual badge check triggered for user:', req.user.id);
        const newBadges = await checkAndUnlockBadges(req.user.id);
        res.status(200).json({
            message: 'Manual check complete',
            newBadges: newBadges
        });
    } catch (error) {
        console.error('Manual check error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

module.exports = router;