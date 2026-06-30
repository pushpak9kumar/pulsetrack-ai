
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

// AI General Chat (Fitness Coach)
const getCoachResponse = async (userMessage, userContext) => {
    // ✅ CONTEXT KO FORMATTED STRING ME CONVERT KARO
    const contextText = `
    User Profile:
    - Name: ${userContext.name}
    - Level: ${userContext.level} (XP: ${userContext.totalXP})
    
    Recent Workouts (Last 5):
    ${userContext.recentWorkouts.map(w => 
      `• ${w.type} - ${w.duration} mins, ${w.calories} cal (${w.date})`
    ).join('\n    ')}
    
    Current Goal: ${userContext.currentGoal 
      ? `${userContext.currentGoal.progress} (Target: ${userContext.currentGoal.target} mins)` 
      : 'No active goal'}
    `;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are PulseTrack AI, an expert fitness coach. 

CONTEXT:
${contextText}

INSTRUCTIONS:
1. Use the user's recent workout history to give PERSONALIZED advice
2. If they ask about next workout, suggest based on what they recently did
3. If they're low level, keep advice simple and encouraging
4. If they ask about diet, consider their calorie burn from recent workouts
5. Keep responses under 100 words, friendly, use emojis
6. Speak in Hinglish if user does
7. Mention their recent activities when relevant (e.g., "Since you did Running yesterday...")`
            },
            {
                role: "user",
                content: userMessage
            }
        ],
        max_tokens: 250,
        temperature: 0.7,
    });

    return completion.choices[0].message.content;
};
module.exports = { getWorkoutFeedback,
                   getCoachResponse
 };
