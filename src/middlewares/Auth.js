const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Please login!!!");
        }
        const decodedObj = jwt.verify(token, "Yogesh@123");
        const { _id } = decodedObj;
        const loggedUser = await User.findOne({ _id: _id });
        req.loggedUser = loggedUser;
        next();
    } catch (err) {
        res.status(401).send("ERROR : " + err.message)
    }
}
module.exports = { userAuth };