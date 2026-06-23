const Workout = require('../models/Workout');
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

        // 🔍 YE DEBUG LINE ZAROOR DEKHNA
        console.log("=== DEBUG: DATA BEING SAVED ===");
        console.log(workoutData);
        console.log("================================");

        // Database me save karna
        const newWorkout = await Workout.create(workoutData);

        res.status(201).json({
            message: 'Workout logged successfully',
            workout: newWorkout
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
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if(!workout) {
            return res.status(404).json({ message: 'Workout not found'});
        }

        //Security
        if(workout.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this workout' });
        }

        await workout.findByIdAndDelete(req.params.id);

        res.json({ message: 'workout deleted successfully '});
    }catch (error) {
        console.error('Deleteworkout error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    };

}
    module.exports = {
        createWorkout,
        getWorkouts,
        getWorkoutById,
        updateWorkout,
        deleteWorkout
    };
