const express = require( 'express' );
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createWorkout,
    getworkouts,
    getworkoutById,
    updateworkout,
    deleteWorkout
} = require('../controllers/workoutController');

//all workout routes are protected, hence login is required
router.post('/', protect, createworkout);
router.get('/', protect, getWorkouts);
router.get('/:id', protect, getWorkoutById);
router.put('/:id', protect, updateworkout);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;