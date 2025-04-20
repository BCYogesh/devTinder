const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/Auth')

const app = express();

app.listen(3000);

app.use("/admin", adminAuth);

app.get("/user/login", userAuth, (req, res) => {
    res.send("user logged in successfully");
})

app.get("/admin/allData", (req, res) => {
    res.send("All data fetched successfully");
});

app.delete("/admin/deleteData", (req, res) => {
    res.send("All data deleted successfully");
});





