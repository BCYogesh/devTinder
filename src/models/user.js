const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 20,
    },
    lastName: {
        type: String,
        required: true,
        max: 20,
    },
    mailId: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        max: 50,
        validate: {
            validator: function (value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address: " + value);
                }
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 8,
        max: 20,
        validate: {
            validator: function (value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter strong password " + value);
                }
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 100,
    },
    gender: {
        type: String,
        validate: {
            validator: function (v) {
                if (!['male', 'female', 'other'].includes(v)) {
                    throw new Error("Gender not valid");
                }
            }
        },
        trim: true,
        required: true,
    },
    photoURL: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU1b6NumgqTPC22Q_x8Dcb7XSYm0X9q-tgSA&s",
        trim: true,
    },
    skills: {
        type: [String],
    },
    about: {
        type: String,
        default: "I am software engineer",
        max: 100,
        trim: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);