const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/Auth')

const app = express();

app.listen(3000);

// use try catch for error handling
app.get("/getAllUserData", (req, res) => {
    try {
        throw new Error("Error occured in our application")
        res.send("Get user data fetched successfully");
    } catch (err) {
        res.status(404).send("Something went wrong contact our team")
    }

});

app.use("/", (err, req, res, next) => {
    res.status(404).send("Something went wrong");
})






