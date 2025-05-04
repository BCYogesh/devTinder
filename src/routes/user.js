const express = require("express");
const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../models/connectionReq");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_FIELDS = "firstName lastName skills about";


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedUser = req.loggedUser;

        const requestConnections = await ConnectionRequest
            .find({
                toUserId: loggedUser._id,
                status: "interested",
            })
            .populate("fromUserId", USER_SAFE_FIELDS);

        if (!requestConnections) {
            return res.status(400).json({ message: "Reqeust connection is empty!" });
        }

        return res.json({
            message: "Reqeust connections fetched successfully!",
            data: requestConnections,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedUser = req.loggedUser;

        const connections = await ConnectionRequest
            .find({
                $or: [
                    {
                        fromUserId: loggedUser._id,
                        status: "accepted",
                    },
                    {
                        toUserId: loggedUser._id,
                        status: "accepted",
                    },
                ],
            })
            .populate("fromUserId", USER_SAFE_FIELDS)
            .populate("toUserId", USER_SAFE_FIELDS);

        if (!connections) {
            return res.status(400).json({
                message: "Connections is empty!",
            });
        }

        return res.json({
            message: "Connections fetched successfully!",
            data: connections,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedUser = req.loggedUser;

        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest
            .find({
                $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
            })
            .select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId);
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedUser._id } }
            ]
        }).select(USER_SAFE_FIELDS).skip(skip).limit(limit);

        res.json({
            message: "Feed fetch successfully!",
            data: users
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;
