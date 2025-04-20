const moongose = require('mongoose');


const connectDB = async () => {
    await moongose.connect("mongodb+srv://YogeshBC:Yogesh12345@yogesh.to9jano.mongodb.net/");
}

module.exports = connectDB;



