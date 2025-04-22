const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');


const app = express();

// It will handle all the request
app.use(express.json());

app.post('/signup', async (req, res) => {
    const userData = new User(req.body);
    try {
        // return promise
        await userData.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(401).send("Something went wrong when signup to the user " + err.message)
    }
});

app.post("/filterUser", async (req, res) => {
    const userEmail = req.body.mailId;
    try {
        const user = await User.findOne({ "mailId": userEmail });
        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(401).send("Something went wrong when filter to the user " + err.message)
    }

})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(401).send("Something went wrong when feed the data " + err.message)
    }
})

app.patch("/user", async (req, res) => {
    const userId = req.body.mailId;
    console.log(userId)
    const data = req.body;
    try {
        if (userId) {
            await User.findByIdAndUpdate(userId, data);
            //await User.findOneAndUpdate({ mailId: userId }, data);
            res.send("Data updated successfully");
        }
    } catch (err) {
        res.status(401).send("Something went wrong when update the data " + err.message)
    }
})

app.delete("/deleteUser", async (req, res) => {
    const id = req.body.userId;
    try {
        await User.findByIdAndDelete(id);
        res.send("Delete the user successfully");
    } catch (err) {
        res.status(401).send("Something went wrong when delete the data " + err.message)
    }
})


connectDB().then(() => {
    console.log("DB connection established successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    });
}).catch((err) => {
    console.log("DB connection is failure");
})









