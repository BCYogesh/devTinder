const express = require('express');

const app = express();

app.listen(3000);

// app.get("/hello", (req, res) => {
//     res.send("Hello from hello")
// });

// app.post("/hello", (req, res) => {
//     res.send("data saved successfully")
// });

app.get("/user/:userID/:name/:pass", (req, res) => {
    console.log(req.params);
    res.send({ firstName: "yogesh", lastName: "sekar" })
});

// all http methods request handle in this route
app.all("/secret", (req, res) => {
    res.send("secret routing")
});






