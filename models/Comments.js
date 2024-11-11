const  mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    rating:{
        type: Number,
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId, ref:'orders',
    },
    feedback:{
        type: String
    }
});

const comment = mongoose.model('comments',commentSchema);

module.exports = comment;