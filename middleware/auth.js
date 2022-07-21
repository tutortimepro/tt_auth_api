const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/User');

// Protect Routes
exports.protect = asyncHandler( async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // Set token from bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // Set token from cookie
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    // Make sure token exits
    if(!token){
        return next( new ErrorResponse(`Not authorized to access this route`, 401))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next( new ErrorResponse(`Not authorized to access this route`, 401))
    }
})