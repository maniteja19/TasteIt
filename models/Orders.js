const mongoose = require('mongoose');

const orderScheme = new mongoose.Schema({
    sellerId:{
        type: mongoose.Schema.Types.ObjectId, ref:'seller',
        required: true,
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId, ref:'users',
        required: true,
    },
    items: [{
        dish: {
            type: mongoose.Schema.Types.ObjectId, ref: 'dishes',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type:Number,
            required:true,
        },
    }],
},{timestamps:true});
const order = mongoose.model('orders',orderScheme);

module.exports = order;