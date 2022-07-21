const User = require('../model/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

exports.register = asyncHandler(
    async (req, res, next)=>{
        const { firstname, lastname, email, password } = req.body
        const user = await User.create({
            firstname,
            lastname,
            email,
            password
        });
        // call sendTokenResponse
        sendTokenResponse(user, 201, res);
    }
)

exports.login = asyncHandler(
    async (req, res, next)=>{
        // retrieve from the req.body
        const { email, password } = req.body;
        // Validate email & password
        if(!email | !password){
            return next( new ErrorResponse(`Please provide an email and password`, 400))
        }
        // Check user existence
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return next( new ErrorResponse(`Invalid Credentials`, 401))
        }
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return next( new ErrorResponse(`Invalid Credentials`, 401))
        }
        // call sendTokenResponse
        sendTokenResponse(user, 200, res);
    }
)


// 

exports.getProfile = asyncHandler( async (req, res, next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        message: 'User Profile',
        data: user
    })
})


exports.logout = asyncHandler( async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    
    if(!token){
        return next( new ErrorResponse(`You must be logged to logout`, 402))
    }
    jwt.destroy(token)
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    /**
     * Going to be used for authorization
     */
    const token = user.getSignedJwtToken();

    const options = {
        // 30 days expiry
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true 
    }
    if(process.env.NODE_ENV==='production'){
        options.secure = true
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}


