const prisma = require('../config/sqlConfig');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

// =======================REGISTER========================
const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: 'Please fill all fiels'});
        }
        // to check , email is registered or not
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser) {
            return res.status(400).json({message: 'Email already registered'});
        }

        //Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to the database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        // token generation
        const token = generateToken(newUser.id);

        // sending response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                xp: newUser.xp,
                level: newUser.level
            }
        });

    }catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ messgae: 'Server error', error: error.messgae})
    }
};
//===============================Login=====================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if all fields are filled or not
        if(!email || ! password){
            return res.status(400).json({ message: 'Please provide email and password' });

        }

        //finding User by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials '});
        }

        //Token generate karo 
        const token = generateToken(user.id);

        //sending response
        res.json({
            message: 'Login Successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                xp: user.xp,
                level: user.level
            }
        });
    } catch(error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message});
    }
};

module.exports = { register, login };