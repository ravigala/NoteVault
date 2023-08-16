const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/inotebook';

const connectToMongo = () => {
    mongoose.connect(uri);
    console.log("Connected to Mongo");
}

module.exports = connectToMongo;

