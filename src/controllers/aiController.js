const { getWorkoutFeedback } = require('../services/aiService');
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

module.exports = { getAICoachFeedback };