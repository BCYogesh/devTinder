const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");

const app = express();

// It will handle all the request
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB().then(() => {
    console.log("DB connection established successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    });
}).catch((err) => {
    console.log("DB connection is failure");
})









