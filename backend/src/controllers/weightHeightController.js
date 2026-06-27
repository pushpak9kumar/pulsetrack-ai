const WeightHeightLog = require('../models/WeightHeightLog');

const handleWeightLog = async (req, res) => {
    try {
        const { weight, heightCm } = req.body;
        const userId = req.user.id;

      //  console.log("📉 Weight Log Request:", { userId, weight, heightCm });

        // ✅ Naya entry save karo
        const newLog = await WeightHeightLog.create({
            userId: String(userId),
            weight: Number(weight),
            heightCm: Number(heightCm)
        });

       // console.log("✅ Weight saved:", newLog);

        // ✅ Purani history fetch karo (Line chart ke liye)
        const history = await WeightHeightLog.find({ userId: String(userId) }).sort({ createdAt: 1 });

        // ✅ Current BMI calculate karo
        const heightInMeters = heightCm / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

        res.status(201).json({
            message: 'Weight logged successfully',
            currentBmi: bmi,
            history
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { handleWeightLog };