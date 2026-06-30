const { getWorkoutFeedback, getCoachResponse } = require('../services/aiService');

const Workout = require('../models/Workout');
const prisma = require('../config/sqlConfig');

//AI Coach se feedback lene ka function
const getAICoachFeedback = async (req, res) => {
    try {
        const { workoutId } = req.body;

        //Agar workout diya hai, toh us workout ka data fetch karo
        if(workoutId) {
            const workout = await Workout.findById(workoutId);

            if(!workout) {
                return res.status(404).json({ message: 'Workout not found' });
            }

            //Security check: kya ye workout isi user ka hai
            if(workout.userId.toString() !== String(req.user.id)) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            //fetching User 'level' from postgreSQL
            const user = await prisma.user.findUnique({
                where: { id: req.user.id }
            });

            //AI ko workout data bhejo
            const workoutData = {
                type: workout.type,
                duration: workout.duration,
                calorieBurned: workout.calorieBurned,
                userLevel: user.level
            };

            const aiResponse = await getWorkoutFeedback(workoutData);

            return res.json({
                message: 'AI coach feedback generated',
                workout: workout,
                aiFeedback: aiResponse.feedback
            });
        }

        //if workoutId was not there,then take custom workout data
        const { type, duration, calorieBurned } = req.body;

        if(!type || !duration) {
            return res.status(400).json({
                message: 'Please povide workout type and duration'
            });
        }

        //User ka level fetch karo
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const workoutData = {
            type,
            duration,
            calorieBurned,
            userLevel: user.level
        };

        const aiResponse = await getWorkoutFeedback(workoutData);

        res.json({
            message: 'AI Coach feedback generated',
            aiFeedback: aiResponse.feedback
        });
    } catch (error) {
        console.error('AI Coach error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

// AI General Chat Controller
const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // ✅ 1. USER INFO (Prisma se)
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { 
                level: true, 
                xp: true,
                name: true 
            }
        });

        // ✅ 2. RECENT WORKOUTS (MongoDB se - Last 5)
        const recentWorkouts = await Workout.find({ userId })
            .sort({ date: -1 })
            .limit(5)
            .select('type duration calorieBurned date');

        // ✅ 3. CURRENT GOAL (Prisma se)
        const currentGoal = await prisma.goal.findFirst({
            where: { userId: Number(userId) },
            select: { targetValue: true, currentValue: true }
        });

        // ✅ 4. CONTEXT BANAO
        const userContext = {
            name: user?.name || 'User',
            level: user?.level || 1,
            totalXP: user?.xp || 0,
            recentWorkouts: recentWorkouts.map(w => ({
                type: w.type,
                duration: w.duration,
                calories: w.calorieBurned || 0,
                date: new Date(w.date).toLocaleDateString()
            })),
            currentGoal: currentGoal ? {
                target: currentGoal.targetValue,
                progress: `${currentGoal.currentValue}/${currentGoal.targetValue} mins`
            } : null
        };

        // ✅ 5. AI KO CONTEXT KE SAATH CALL KARO
        const aiReply = await getCoachResponse(message, userContext);

        res.status(200).json({ reply: aiReply });
    } catch (error) {
        console.error('AI Coach Chat error:', error);
        res.status(500).json({ 
            message: 'Failed to get AI response', 
            reply: "Sorry, I'm having trouble connecting. Please try again! 🙏" 
        });
    }
};

module.exports = { getAICoachFeedback,
                    chatWithAI
 };