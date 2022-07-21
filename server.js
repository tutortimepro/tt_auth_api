const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error')

// Load environment variables
dotenv.config({ path: './config/config.env'})
// Database connection
connectDB();

// Bringing in the routers
const auth = require('./routes/auth.routes');

const app = express();

// JSONIFYING express
app.use(express.json());
// Cookies
app.use(cookieParser());
// use morgan
app.use(morgan('dev'))


// Calling the routes to the app
app.use('/api/v1/auth', auth);

// errorHandler
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, ()=>{
        console.log(`Server running in ${process.env.NODE_ENV} mode and port: ${PORT}`)
    }
)

process.on('unhandledRejection', (err, promise)=> {
    console.log(`Error: ${err.message}`);
    server.close(()=>{
        process.exit(1);
    })
})