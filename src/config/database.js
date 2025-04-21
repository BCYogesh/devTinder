const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://YogeshBC:Yogesh12345@yogesh.to9jano.mongodb.net/devTinder");
}

module.exports = connectDB;



