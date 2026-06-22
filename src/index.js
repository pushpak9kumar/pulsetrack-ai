const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectMongo = require('./config/mongoConfig');
const prisma = require('./config/sqlconfig');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send('PulseTrack AI Backend is Runnig!');
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