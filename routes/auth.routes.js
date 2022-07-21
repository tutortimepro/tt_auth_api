const express = require('express');
const { 
    register, getProfile, login, logout
} = require('../controllers/auth.controller')

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/register')
    .post(register)

router.route('/login')
    .post(login)

router.route('/profile/:id')
    .get(protect, getProfile)
    
router.route('/logout')    
    .get(logout)

module.exports = router;