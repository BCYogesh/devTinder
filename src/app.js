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
const chatRouter = require('./routes/chat');


require('dotenv').config()

const app = express();

// It will handle all the request

const httpServer = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5173",
    "https://resilient-kulfi-91a455.netlify.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }));

app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

initializeSocket(httpServer);

connectDB().then(() => {
    console.log("DB connection established successfully");
    httpServer.listen(process.env.PORT, () => {
        console.log("Server is running on port 3000")
    });
}).catch((err) => {
    console.log("DB connection is failure");
})









