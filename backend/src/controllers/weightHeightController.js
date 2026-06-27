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

//function for history fetching
const getWeightHistory = async (req, res) => {
    try {
        const userId = String(req.user.id);
        let history = (await WeightHeightLog.find({ userId: userId }));

        //Native Js comparision function
        history.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));

        let currentBmi = null;

        if(history.length > 0) {
            const latest = history[history.length - 1];
            const heightInMeters = latest.heightCm / 100;
            currentBmi = (latest.weight / (heightInMeters * heightInMeters)).toFixed(1);
        }

        res.status(200).json({ history, currentBmi });
    } catch (error) {
        console.error(' Get weight history serror:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { handleWeightLog, getWeightHistory };