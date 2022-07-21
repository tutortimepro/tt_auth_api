const fs = require('fs');
const mongoose = require('mongoose');

const User = require('./model/User');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

// Make connection to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})
console.log(`Connected to destroy db`);

// Delete data in the database
const deleteData = async ()=>{
    try {
        await User.deleteMany();
        console.log(`Data Deleted`);
        process.exit(1);
    } catch (err) {
        console.log(err)
    }
}

// Execution
if(process.argv[2] === '-d'){
    deleteData();
}