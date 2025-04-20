const express = require('express');
const connectDB = require('./config/database');

const app = express();

connectDB().then(() => {
    console.log("DB connection established successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    });
}).catch((err) => {
    console.log("DB connection is failure");
})









