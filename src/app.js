var express = require('express');
var connectDB = require('./config/database');
var cookieParser = require('cookie-parser');
var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');
var requestRouter = require('./routes/request');
var userRouter = require("./routes/user");
var cors = require("cors");

require('dotenv').config()

const app = express();

// It will handle all the request


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB().then(() => {
    console.log("DB connection established successfully");
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port 3000")
    });
}).catch((err) => {
    console.log("DB connection is failure");
})









