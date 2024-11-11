const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    name : {
        type: String,
        Required:true,
    },
    email: {
        type: String,
        Required : true,
        unique: true
    },
    phone : {
        type: String,
        Required:true,
    },
    password : {
        type: String,
        Required:true,
    },
    role:{
        type:String,
        Required:true,
    },
    address:{
        type:String,
        default:'',
    },
    image:String,
    favourites:[{
        type: mongoose.Schema.Types.ObjectId, ref:'seller',
    }],
},{timestamps:true})

const User = mongoose.model('users',userScheme);

module.exports = User;