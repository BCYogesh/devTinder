const express = require('express');
const { userAuth } = require('../middlewares/Auth');

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const { loggedUser } = req;
        res.send(loggedUser);
    } catch (err) {
        res.status(401).send("ERROR : " + err.message)
    }
});

module.exports = profileRouter;
