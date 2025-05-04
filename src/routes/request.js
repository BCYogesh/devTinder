const express = require("express");
const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../models/connectionReq");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.get("/connectionRequest", userAuth, async (req, res) => {
    try {
        res.send("Connection request");
    } catch (err) {
        res.status(400).send("ERROR : " + err.messsage);
    }
});

requestRouter.post(
    "/request/send/:status/:userId",
    userAuth,
    async (req, res) => {
        try {
            const user = req.loggedUser;
            const toUserId = req.params.userId;
            const status = req.params.status;

            if (!["interested", "ignored"].includes(status)) {
                res.status(400).send("Not a valid request status type " + status);
            }

            const toUserData = await User.findById(toUserId);

            if (!toUserData) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId: user._id, toUserId: toUserId },
                    { fromUserId: toUserId, toUserId: user._id },
                ],
            });

            if (existingConnectionRequest) {
                return res.status(400).json({
                    message: "Connection request already exist!",
                });
            }

            const connectionReq = new ConnectionRequest({
                fromUserId: user._id,
                toUserId: toUserId,
                status: status,
            });

            await connectionReq.save();
            res.json({
                message: "Connection request sent sucessfully!",
                response: `${user.firstName} is ${status} in ${toUserData.firstName}`,
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            // status => accepted, rejected
            const user = req.loggedUser;
            const { status, requestId } = req.params;
            // check status is valid
            if (!["accepted", "rejected"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid status type!"
                })
            }
            // check requestId is valid
            // to fetch only status should be interested otherwise don't fetch the data
            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: user._id,
                status: "interested"
            })

            if (!connectionRequest) {
                return res.status(404).json({
                    message: "Connection request not found!"
                })
            }

            connectionRequest.status = status;

            await connectionRequest.save();

            return res.json({
                message: `Connection ${status} successfully`
            });
        } catch (err) {
            res.status(400).json({ error: "ERROR " + err.message });
        }

    }
);



module.exports = requestRouter;
