const express = require('express');
const cors = require('cors');
require('dotenv').config();


const connectMongo = require('./config/mongoConfig');
const prisma = require('./config/sqlconfig')
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // every auth routes /api/auth se start honge
app.use('/api/workouts', workoutRoutes);
app.use('/api/ai', aiRoutes);

//basic test routh
app.get('/', (req,res) => {
    res.send('PulseTrack AI Backend is Runnig!');
});

//Protected routh test for logged inusers
app.get('/api/protected', require('./middleware/authMiddleware').protect, (req,res) => {
    res.json({
        message: 'Ypu assessed a protcted route!',
        user: req.user // middleware attach user
    });
});

const PORT = process.env.PORT || 5000;
//db connection then start server
const startServer = async () => {
    try {
        await connectMongo();

        await prisma.$connect();
        console.log('PostGreSQL (Prisma) Connected Successfully!');

        app.listen(PORT, () => {
            console.log(`Server is runnig on http://localhost;${PORT}`);
        });
    }catch(error){
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();