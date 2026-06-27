const mongoose = require('mongoose');

const weightHeightLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    weight: {
        type: Number,
        required: true
    },
    heightCm: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const WeightHeightLog = mongoose.model('WeightHeightLog', weightHeightLogSchema);

module.exports = WeightHeightLog;