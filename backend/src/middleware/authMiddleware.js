const jwt = require('jsonwebtoken');
const prisma = require('../config/sqlConfig');


//ye middleware check karega ki user logged in hai ya nahi
const protect = async (req, res, next) => {
    try {
        // find token in header
        let token;

        //Authorization header me "Bearer <token> format me token aata hai"
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];// part after the bearer part
        }

        //if token was not there , send error message
        if(!token) {
            return res.status(401).json({message: 'Not authorized, no token '});
        }
        //Token verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if(!user){
            return res.status(401).json({ message: 'User not found' });
        }

        //attach user to the request so that other routes use it
        req.user = user;

        next(); //go to next, routh handler
        
    } catch(error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized ,Token failed'});
    }
};

module.exports = { protect };
