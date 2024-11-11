const comment = require('../models/Comments');
const { populate } = require('../models/User');

const commentsController = async(req,res) => {
    const {orderId, rating, feedback} = req.body;
    try{
        console.log(orderId, rating, feedback);
        const newRating = new comment({
            orderId,
            rating,
            feedback,
        });
        await newRating.save();
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"error",error});
    }
    
}

const getCommentsController = async(req,res) => {
    const {userId} = req.params;
    try{
        const response = await comment.find().populate('orderId');
        let matchingOrderIds = [];
        response.forEach(comments => {
            
        if (comments.orderId && comments.orderId.userId) {
            const id = comments.orderId.userId.toString();
            if (userId === id) {
                const f ={
                    orderId : comments.orderId._id,
                    rating: comments.rating,
                    feedback: comments.feedback,
                }
                matchingOrderIds.push(f);
            }
        } else {
            console.log('No associated userId found for this order.');
        }
        });
        res.send(matchingOrderIds);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error});
    }
}

const displayFeedback = async(req,res) => {
    const {userId} = req.params;
    try{
        const response = await comment.find()
        .populate({
            path:'orderId',
            populate:{
                path:'userId'
            }
        });
        let matchingOrderIds = [];
        let rating = 0;
        let feedbacks = [];
        response.forEach(comments => {
            
        if (comments.orderId && comments.orderId.userId) {
            const id = comments.orderId.sellerId.toString();
            if (userId === id) {
                const feedbackDetails ={
                    orderId : comments.orderId._id,
                    userName: comments.orderId.userId.name,
                    rating: comments.rating,
                    feedback: comments.feedback,
                }
                matchingOrderIds.push(feedbackDetails);
            }
        } else {
            console.log('No associated userId found for this order.');
        }
        });
        for(let i = 0;i<matchingOrderIds.length;i++){
            rating += matchingOrderIds[i].rating;
            if(matchingOrderIds[i].feedback){
                const obj ={
                    orderId: matchingOrderIds[i].orderId,
                    username: matchingOrderIds[i].userName,
                    feedback: matchingOrderIds[i].feedback,
                }
                feedbacks.push(obj);
            }
        }
        res.status(200).json({'rating': rating/matchingOrderIds.length, 'feedback': feedbacks });
    }
    catch(error){
        console.log(error);
        res.status(500).json({error});
    }
}

module.exports = {
    commentsController,
    getCommentsController,
    displayFeedback
}; 