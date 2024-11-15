const  mongoose = require('mongoose');

const dishesScheme = new mongoose.Schema({
    dishName:{
        type:String,
        required: true,
    },
    dishQuantity:{
        type: Number,
        required:true,
        min: [1, 'Quantity must be at least 1'],
    },
    dishPrice:{
        type: Number,
        required: true,
    },
    dishDescription:{
        type: String,
        required: true,
    },
    dishType:{
        type: String,
        required: true,
    },
    seller: String,
});

const dishes = mongoose.model('dishes',dishesScheme);

module.exports = dishes;