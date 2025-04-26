const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const userSignupValidation = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/Auth')
const app = express();

// It will handle all the request
app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {

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
        res.status(401).send("Something went wrong when signup to the user " + err.message)
    }
});

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credientials");
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            throw new Error("Invalid credientials");
        }
        const token = jwt.sign({ _id: user._id }, "Yogesh@123");
        res.cookie("token", token);
        res.send("Login successful!")
    } catch (err) {
        res.status(401).send("ERROR : " + err.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const { loggedUser } = req;
        res.send(loggedUser);
    } catch (err) {
        res.status(401).send("ERROR : " + err.message)
    }
})

app.post("/filterUser", async (req, res) => {
    const userEmail = req.body.mailId;
    try {
        const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills', 'password'];

        const isUpdateAllowed = Object.keys(data).every((k) => {
            ALLOWED_UPDATES.includes(k);
        })

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        const user = await User.findOne({ "mailId": userEmail });
        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(401).send("Something went wrong when filter to the user " + err.message)
    }

});

app.get("/feed", userAuth, async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            res.status(404).send("No data found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(401).send("Something went wrong when feed the data " + err.message)
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

        const isUpdateAllowed = Object.keys(data).every((k) => {
            ALLOWED_UPDATES.includes(k);
        })

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if (data?.skills.length >= 10) {
            throw new Error("Skills not allowed more than 10")
        }
        await User.findByIdAndUpdate(userId, data, { runValidators: true });
        //await User.findOneAndUpdate({ mailId: userId }, data);
        res.send("Data updated successfully");

    } catch (err) {
        res.status(401).send("Something went wrong when update the data : " + err.message)
    }
})

app.delete("/deleteUser", async (req, res) => {
    const id = req.body.userId;
    try {
        await User.findByIdAndDelete(id);
        res.send("Delete the user successfully");
    } catch (err) {
        res.status(401).send("Something went wrong when delete the data " + err.message);
    }
});


connectDB().then(() => {
    console.log("DB connection established successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    });
}).catch((err) => {
    console.log("DB connection is failure");
})









