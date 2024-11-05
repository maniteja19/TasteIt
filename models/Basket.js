
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BasketSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  items: [
    {
      dish: {
        type: Schema.Types.ObjectId, ref: 'dishes',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type:Number
      },
      sellerId: {
        type: String
      },
    },
  ],
});

module.exports = mongoose.model('Basket', BasketSchema);
