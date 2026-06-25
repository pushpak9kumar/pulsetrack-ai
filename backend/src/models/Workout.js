const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Bada 'S' aur String
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    calorieBurned: { type: Number },
    date: { type: Date, default: Date.now } // 'date' likha hai, 'data' nahi
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;