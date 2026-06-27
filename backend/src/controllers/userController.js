const prisma = require('../config/sqlConfig');
const { calculateLevel } = require('../services/xpService');

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

const getGoal = async (req, res) => {
    try {
        // User ka latest goal dhundo
        let goal = await prisma.goal.findFirst({
            where: { userId: req.user.id },
            orderBy: { id: 'desc' }
        });

        // Agar koi goal nahi hai, toh ek default goal bana do
        if (!goal) {
            goal = await prisma.goal.create({
                data: {
                    title: "Weekly Workout Goal",
                    targetValue: 100, // Default 100 mins
                    currentValue: 0,
                    userId: req.user.id
                }
            });
        }

        res.status(200).json(goal);
    } catch (error) {
        console.error('Get goal error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateGoal = async (req, res) => {
    try {
        const { targetValue } = req.body;

        let latestGoal = await prisma.goal.findFirst({
            where: { userId: req.user.id },
            orderBy: { id: 'desc' }
        });

        // Agar goal nahi hai, toh pehle create karo
        if (!latestGoal) {
            latestGoal = await prisma.goal.create({
                data: {
                    title: "Weekly Workout Goal",
                    targetValue: Number(targetValue),
                    currentValue: 0,
                    userId: req.user.id
                }
            });
        } else {
            // Goal hai, toh update karo
            latestGoal = await prisma.goal.update({
                where: { id: latestGoal.id },
                data: { targetValue: Number(targetValue) }
            });
        }

        res.status(200).json({ message: "Goal updated successfully", goal: latestGoal });
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { getUserStats, getGoal, updateGoal };