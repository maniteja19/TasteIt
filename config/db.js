const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

// const MONGO_URI = "mongodb://localhost:27017/TasteIt"
const MONGO_URI = "mongodb+srv://maniteja:Maniteja12@cluster0.yx6fc0l.mongodb.net/TasteIt?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('db connected');
});

module.exports = db;