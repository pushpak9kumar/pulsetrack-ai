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
                    title: "Weekly Goal"
                }
            });
        }

        const workouts = await prisma.workout.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });

        const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.duration), 0);
        
        const updatedGoal = await prisma.goal.update({
            where: { id: goal.id },
            data: { currentValue: totalMinutes }
        });

        if (updatedGoal.currentValue >= updatedGoal.targetValue && updatedGoal.targetValue > 0) {
            await trackCompletedGoal(userId, updatedGoal.targetValue);
            
            await prisma.goal.update({
                where: { id: goal.id },
                data: { currentValue: 0 }
            });
            
            updatedGoal.currentValue = 0;
            updatedGoal.achieved = true;
        } else {
            updatedGoal.achieved = false;
        }

        res.status(200).json(updatedGoal);
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
                    title: "Weekly Goal"
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