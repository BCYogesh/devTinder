const validator = require('validator');

const userSignupValidation = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Please enter strong password');
    }
};

const profileEditValidation = (req) => {
    try {
        const allowedEditFields = ["firstName", "lastName", "age", "gender", "photoURL", "skills", "about"];
        const isAllowEdit = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
        if (!isAllowEdit) {
            throw new Error("Not valid field edit request");
        }
        return isAllowEdit;
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
}
const profilePWDEditValidation = (req) => {
    try {
        const allowedEditFields = ["password"];
        const isAllowEdit = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
        if (!isAllowEdit) {
            throw new Error("Not valid field edit request");
        }
        return isAllowEdit;
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
}

module.exports = {
    userSignupValidation,
    profileEditValidation,
    profilePWDEditValidation
};