const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    type: {type: String,required: true},
    duration: {type: Number,required: true},
    calorieBurned: {type: Number},
    data: {type: Date, default: Date.now }
}, {timestamps: true});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;