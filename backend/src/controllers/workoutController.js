const Workout = require('../models/Workout');
const { calculateXP, calculateLevel } = require('../services/xpService');
//===========================create workout ===========
const createWorkout = async (req, res) => {
    try {
        const { type, duration, calorieBurned } = req.body;

        if (!type || !duration) {
            return res.status(400).json({ message: 'Please provide type and duration' });
        }

        // Humara final data jo database me jayega
        const workoutData = {
            userId: String(req.user.id), // Number ko String me convert kiya
            type,
            duration,
            calorieBurned,
            date: req.body.date || Date.now()
        };

        // Database me save karna
        const newWorkout = await Workout.create(workoutData);
        
        //calculating xp
        const earnedXP = calculateXP(duration, calorieBurned);
        //fetching user current XP
        const currentUser = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const newTotalXP = currentUser.xp + earnedXP;

        //calculating level
        const levelInfo = calculateLevel(newTotalXP);

        //update user
        const updatedUser= await prisma.user.update({
            where: { id: req.user.id },
            data: {
                xp: newTotalXP,
                level: levelInfo.level
            }
        });

      const { checkAndUnlockBadges } = require('./achievementController');
const newBadges = await checkAndUnlockBadges(req.user.id);

res.status(201).json({
    message: 'Workout logged successfully',
    workout: newWorkout,
    newBadges: newBadges,
    xpEarned: earnedXP,
    userStats: {
        totalXP: newTotalXP,
        level: levelInfo.level,
        xpToNextLevel: levelInfo.xpToNextLevel
    }
});

 } catch (error) {
        console.error('Create workout error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



//==========================GET all Workout(for logged in users only) ====================
const getWorkouts = async (req, res) => {
    try {
        //finding only those workout in database whose userId matches with current ID
        const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1});// des order

        res.json({
            count: workouts.length,
            workouts
        });

    } catch (error) {
        console.error('Get workouts error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};

//========================= Get single workout===========
const getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if(!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        //Security check
        if(workout.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to view this workout' });
        }

        res.json(workout);
    } catch(error) {
        console.error('Geet workout by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//========================== Update Workout =============
const updateWorkout = async(req, res) => {
    try {
        const workout = await Workout.findByIdAndUpdate(req.params.id);

        if(!workout) {
            return res.status(404).json({ message: 'workout not found' });
        }

        //Security check
        if(workout.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this workout '});
        }

        //Update 
        const updatedWorkout = await workout.findByIdAndUpdate(
            req.params.id,
            req.body,// jo bhi naya datahai bodyme aaya hai
            { new: true, runValidators: true }// new: true, means updated data wapsa do 
        );

        res.josn({
            message: 'Workout updtaed successfully',
            workout: updatedworkout
        });
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// =============================Delete Workout ============================

        //Security
           // ✅ Dono ko number me convert karke compare kar
// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        // Authorization check - dono ko String me convert karke compare karo
        if (String(workout.userId) !== String(req.user.id)) {
            return res.status(401).json({ message: "Not authorized to delete this workout" });
        }

        await Workout.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
    module.exports = {
        createWorkout,
        getWorkouts,
        getWorkoutById,
        updateWorkout,
        deleteWorkout
    };
