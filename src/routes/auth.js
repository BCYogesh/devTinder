// login,logout,signup
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { userSignupValidation } = require('../utils/validation');

const authRouter = express.Router();


authRouter.post('/signup', async (req, res) => {
    try {
        // validation
        userSignupValidation(req);
        const { firstName, lastName, emailId, password } = req.body;
        // encrypt password
        const hashPassword = await bcrypt.hash(password, 10);
        const userData = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword
        });
        await userData.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(401).send("ERROR : " + err.message)
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credientials");
        }
        const isPassword = await user.verifyPassword(password);
        if (!isPassword) {
            throw new Error("Invalid credientials");
        }
        const token = await user.getJWT();

        res.cookie("token", token, { expires: new Date(Date.now() + 24000000) });
        res.send("Login successful!");
    } catch (err) {

        res.status(401).send("ERROR : " + err.message)
    }
});

authRouter.get("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("Logout success");
});

module.exports = authRouter;