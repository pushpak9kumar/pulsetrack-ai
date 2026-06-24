const prisma = require('../config/sqlConfig');
const { calculateLevel } = require('../service/xpService');

//function to see user progress
const getUserStats = async ( req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select:{
                id: true,
                name: true,
                email: true,
                xp: true,
                level:true,
                createdAt: true
            }
        });

        const levelInfo = calculateLevel(user.xp);

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                totalXP: user.level,
                xpToNextLevel: levelInfo.xpToNextLevel,
                memberSince: user.createdAt
            }
        });
        
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({message: 'Server error', error: error.message });
    }
};

module.exports = { getUserStats };