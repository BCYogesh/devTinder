const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");
const cors = require("cors");
const http = require("http");
const initializeSocket = require('./utils/socket');


require('dotenv').config()

const app = express();

// It will handle all the request

const httpServer = http.createServer(app);

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

initializeSocket(httpServer);

connectDB().then(() => {
    console.log("DB connection established successfully");
    httpServer.listen(process.env.PORT, () => {
        console.log("Server is running on port 3000")
    });
}).catch((err) => {
    console.log("DB connection is failure");
})









