const mongoose = require('mongoose');

const SellerScheme = new mongoose.Schema({
    restaurantName:{
        type: String,
        required:true,
        unique:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    role:{
        type:String,
        default:'seller',
        required: true,
    },
    photo:{
        type:String,
    },
    address:{
        type: String,
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'dishes'
    }],
    count: {
        type:Number,
        default:0,
    },
},{timestamps:true})

const Seller = mongoose.model('seller',SellerScheme)

module.exports = Seller;