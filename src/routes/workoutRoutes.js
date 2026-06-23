const express = require( 'express' );
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout
} = require('../controllers/workoutController');

//all workout routes are protected, hence login is required
router.post('/', protect, createWorkout);
router.get('/', protect, getWorkouts);
router.get('/:id', protect, getWorkoutById);
router.put('/:id', protect, updateWorkout);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;