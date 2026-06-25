/*
const { GoogleGenerativeAI } = require('@google/generative-ai');

//initialising AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//ai coach function, which analyse workout data
const getWorkoutFeedback = async (workoutData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-flash-latest"});

        //Promt engineering - AI ko batana ki kya karna hai
        const prompt = `
        You are a professional fitness coach and nutrition expert. Analyze the following workout data and provide:

1. **Performance Analysis** (2-3 lines): How good was this workout?
2. **Improvement Tips** (3 bullet points): Specific actionable advice
3. **Nutrition Suggestion** (1-2 lines): What to eat before/after this workout
4. **Motivation** (1 line): An encouraging message

Workout Data:
- Type: ${workoutData.type}
- Duration: ${workoutData.duration} minutes
- Calories Burned: ${workoutData.calorieBurned || 'Not specified'}
- User Level: ${workoutData.userLevel || 'Beginner'}

Keep the response concise, practical, and motivating. Use emojis to make it engaging.
`;

      //AI se response generate karo
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        feedback: text
      };
    } catch (error) {
        console.error('AI Service error:', error);
        return {
            success: false,
            feedback: 'Sorry, AI coach is currently unavailable. Please try again later.',
            error: error.message
        };
    }
};

module.exports = { getWorkoutFeedback };
*/
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getWorkoutFeedback = async (workoutData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a professional fitness coach and nutrition expert. Analyze the following workout data and provide:

1. **Performance Analysis** (2-3 lines)
2. **Improvement Tips** (3 bullet points)
3. **Nutrition Suggestion** (1-2 lines)
4. **Motivation** (1 line)

Workout Data:
- Type: ${workoutData.type}
- Duration: ${workoutData.duration} minutes
- Calories Burned: ${workoutData.calorieBurned || 'Not specified'}
- User Level: ${workoutData.userLevel || 'Beginner'}

Keep the response concise and motivating. Use emojis.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            feedback: text
        };

    } catch (error) {
        console.error('AI Service error:', error.message);
        return {
            success: false,
            feedback: 'Sorry, AI coach is currently unavailable.',
            error: error.message
        };
    }
};

module.exports = { getWorkoutFeedback };
