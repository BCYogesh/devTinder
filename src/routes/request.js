const express = require('express');
const { userAuth } = require('../middlewares/Auth');

const requestRouter = express.Router();

requestRouter.get('/connectionRequest', userAuth, async (req, res) => {
    try {
        res.send("Connection request");
    } catch (err) {
        res.status(400).send("ERROR : ", err.messsage);
    }
});

module.exports = requestRouter;