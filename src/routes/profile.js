const express = require('express');
const { userAuth } = require('../middlewares/Auth');
const { profileEditValidation, profilePWDEditValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const { loggedUser } = req;
        res.send(loggedUser);
    } catch (err) {
        res.status(401).send("ERROR : " + err.message)
    }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.loggedUser;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const isAllowEdit = profileEditValidation(req);
        if (!isAllowEdit) {
            throw new Error("Invalid edit request");
        }
        const loggedUser = req.loggedUser;
        Object.keys(req.body).forEach((field) => loggedUser[field] = req.body[field]);
        await loggedUser.save();
        res.send({
            message: `${loggedUser.firstName} your profile has been updated.`,
            data: [loggedUser]
        })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }

});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const isEdit = profilePWDEditValidation(req);
        if (!isEdit) {
            throw new Error("Invalid edit request");
        }
        const user = req.loggedUser;
        const { password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        await user.save();
        res.send({
            message: "Forget password successfully",
            userName: `${user.firstName}`
        })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = profileRouter;
