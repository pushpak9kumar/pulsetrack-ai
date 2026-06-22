const express = require( 'express' );
const router = express.Router();
const { register, login } = require('../controllers/authController');

//POST /api/auth/register - User register karega
router.post('/register', register);

//POST /api/auth/login - USer login karega
router.post('/login', login);

module.exports = routes;