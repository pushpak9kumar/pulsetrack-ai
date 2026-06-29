const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Workout = require('../models/Workout');

// Save goal to history and reset
const saveGoalToHistoryAndReset = async (userId, goalId) => {
    try {
        const goal = await prisma.goal.findFirst({ where: { id: Number(goalId) } });
        if (!goal) return;

        // Save to history
        await prisma.goalHistory.create({
            data: {
                userId,
                targetValue: goal.targetValue,
                completedAt: new Date()
            }
        });

        // Reset goal
        await prisma.goal.update({
            where: { id: goalId },
            data: {
                currentValue: 0,
                cycleStartAt: new Date()
            }
        });
    } catch (error) {
        console.error('Save goal to history error:', error);
    }
};
// Get user stats (total workouts, XP, level, etc.)
const getUserStats = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        
        // Total workouts count
        const totalWorkouts = await Workout.countDocuments({ userId: String(userId) });
        
        // Total duration
        const workouts = await Workout.find({ userId: String(userId) });
        const totalDuration = workouts.reduce((sum, w) => sum + Number(w.duration), 0);
        
        // Total calories
        const totalCalories = workouts.reduce((sum, w) => sum + Number(w.calorieBurned || 0), 0);
        
        // User info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { xp: true, level: true, name: true }
        });

        res.status(200).json({
            totalWorkouts,
            totalDuration,
            totalCalories,
            xp: user?.xp || 0,
            level: user?.level || 1,
            name: user?.name || ''
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user goal
const getUserGoal = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        
        let goal = await prisma.goal.findFirst({
            where: { userId }
        });

        // Agar goal nahi hai, toh default goal banao
        if (!goal) {
            goal = await prisma.goal.create({
                data: {
                    userId,
                    targetValue: 100,
                    currentValue: 0,
                    cycleStartAt: new Date()
                }
            });
        }

        // ✅ WORKOUT COUNTING HATA DIYA
        // Goal update logic sirf workoutController.js me hai
        // currentValue ko override nahi karenge

        // Check if goal achieved
        const isAchieved = goal.currentValue >= goal.targetValue;

        res.status(200).json({
            ...goal,
            achieved: isAchieved
        });
    } catch (error) {
        console.error('Get goal error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Update user goal
// Update user goal
// Update user goal
const updateUserGoal = async (req, res) => {
    try {
        const { targetValue } = req.body;
        const userId = Number(req.user.id);

        if (!targetValue || targetValue <= 0) {
            return res.status(400).json({ message: 'Target value must be greater than 0' });
        }

        let goal = await prisma.goal.findFirst({
            where: { userId }
        });

        if (!goal) {
            goal = await prisma.goal.create({
                data: {
                    userId,
                    targetValue: Number(targetValue),
                    currentValue: 0,
                    cycleStartAt: new Date()
                }
            });
        } else {
            // Update target value
            goal = await prisma.goal.update({
                where: { id: goal.id },
                data: { targetValue: Number(targetValue) }
            });

            // ✅ CHECK IF GOAL ALREADY ACHIEVED
            if (goal.currentValue >= goal.targetValue) {
                console.log("🎯 Goal already achieved! Resetting...");
                await saveGoalToHistoryAndReset(userId, goal.id);
                
                // Fetch updated goal after reset
                goal = await prisma.goal.findFirst({ where: { userId } });
            }
        }

        res.status(200).json(goal);
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get goal history (last 10 goals)
const getGoalHistory = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        
        const history = await prisma.goalHistory.findMany({
            where: { userId },
            orderBy: { completedAt: 'desc' },
            take: 10
        });

        res.status(200).json(history);
    } catch (error) {
        console.error('Get goal history error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Save goal to history and reset
/*
const saveGoalToHistoryAndReset = async (userId, goalId) => {
    try {
        console.log(`🔄 Starting reset for User: ${userId}, Goal ID: ${goalId}`);
        
        const goal = await prisma.goal.findFirst({ where: { id: Number(goalId) } });
        if (!goal) {
            console.log(" Goal not found in DB for reset");
            return;
        }

        // Save to history
        await prisma.goalHistory.create({
            data: {
                userId,
                targetValue: goal.targetValue,
                completedAt: new Date()
            }
        });
        console.log("✅ Saved to history");

        // Reset goal
        await prisma.goal.update({
            where: { id: goalId },
            data: {
                currentValue: 0,
                cycleStartAt: new Date() // ✅ Ye line sabse zaroori hai
            }
        });
        console.log("🔄 Goal reset to 0 and cycleStartAt updated");

    } catch (error) {
        console.error('❌ Save goal to history error:', error);
    }
};
*/

module.exports = { getUserStats,getUserGoal, updateUserGoal, getGoalHistory, saveGoalToHistoryAndReset };