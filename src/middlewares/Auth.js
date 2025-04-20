// I have to check all the methods for who is admin or not
// This code is example for middleware
const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAuth = token === "xyz";
    if (!isAuth) {
        res.status(401).send("Your not a admin");
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    const token = "xyz1";
    const isAuth = token === "xyz";
    if (!isAuth) {
        res.status(401).send("Your not a user");
    } else {
        next();
    }
}
module.exports = { adminAuth, userAuth };