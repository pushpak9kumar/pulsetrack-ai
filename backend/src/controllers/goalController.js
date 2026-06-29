const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const trackCompletedGoal = async (userId, targetValue) => {
    try {
        await prisma.goalHistory.create({
            data: {
                userId: Number(userId),
                targetValue: Number(targetValue),
                completedAt: new Date()
            }
        });
        console.log('✅ Goal history tracked');
    } catch (error) {
        console.error('Error tracking goal history:', error);
    }
};

const getGoal = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        
        let goal = await prisma.goal.findFirst({
            where: { userId: userId }
        });

        if (!goal) {
            goal = await prisma.goal.create({
                data: {
                    userId: userId,
                    targetValue: 100,
                    currentValue: 0,
                    title: "Weekly Goal",
                    cycleStartAt: new Date()
                }
            });
        }

        // ✅ Sirf cycleStartAt ke baad ke workouts count karo
        const workouts = await prisma.workout.findMany({
            where: { 
                userId: userId,
                createdAt: {
                    gte: goal.cycleStartAt
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.duration), 0);
        
        // ✅ currentValue update karo
        goal = await prisma.goal.update({
            where: { id: goal.id },
            data: { currentValue: totalMinutes }
        });

        // ✅ Check karo goal achieve hua ya nahi
        if (totalMinutes >= goal.targetValue && goal.targetValue > 0) {
            await trackCompletedGoal(userId, goal.targetValue);
            
            // ✅ Cycle reset karo - cycleStartAt ko abhi ka time do
            goal = await prisma.goal.update({
                where: { id: goal.id },
                data: { 
                    currentValue: 0,
                    cycleStartAt: new Date()
                }
            });
            
            goal.achieved = true;
        } else {
            goal.achieved = false;
        }

        res.status(200).json(goal);
    } catch (error) {
        console.error('Get goal error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateGoal = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        const { targetValue } = req.body;

        let goal = await prisma.goal.findFirst({
            where: { userId: userId }
        });

        if (!goal) {
            goal = await prisma.goal.create({
                data: {
                    userId: userId,
                    targetValue: Number(targetValue),
                    currentValue: 0,
                    title: "Weekly Goal",
                    cycleStartAt: new Date()
                }
            });
        } else {
            goal = await prisma.goal.update({
                where: { id: goal.id },
                data: { targetValue: Number(targetValue) }
            });
        }

        res.status(200).json(goal);
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getGoalHistory = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        
        const history = await prisma.goalHistory.findMany({
            where: { userId: userId },
            orderBy: { completedAt: 'desc' },
            take: 10
        });

        res.status(200).json(history);
    } catch (error) {
        console.error('Get goal history error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getGoal, updateGoal, getGoalHistory };