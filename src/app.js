const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');


const app = express();

app.post('/signup', async (req, res) => {
    const userData = new User({
        firstName: "Ravindra",
        lastName: "Jadeja",
        mailId: "Jadeja@gmail.com",
        password: "jadeja@123",
        gender: "Male"
    });

    try {
        // return promise
        await userData.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(401).send("Something went wrong when signup to the user " + err.message)
    }

});


connectDB().then(() => {
    console.log("DB connection established successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    });
}).catch((err) => {
    console.log("DB connection is failure");
})









