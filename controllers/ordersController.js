const User = require('../models/User');
const Orders = require('../models/Orders')
const Seller = require('../models/Seller');
const bookOrders = async (req,res) =>{
    const {basket,grandTotal} = req.body;
    try{
        const newOrder = new Orders({
            sellerId: basket.items[0].dish.seller,
            userId: basket.user,
            total:grandTotal,
            items:basket.items,
        })
        
        await newOrder.save();
    }
    catch(error){
        console.log(error);
        res.status(500).json({"error": error});
    }
}
const getOrders = async (req, res) => {
  const id = req.user.userId;
  try {

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Orders.find({ userId: id })
      .populate({ path: 'items.dish' })
      .populate('sellerId');

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

const getOrderedDishes = async(req,res) => {
  const id =  req.user.userId;

  try{
    const seller = await Seller.findOne({_id: id});
    if(!seller){
      return res.status(404).json({message:" seller not found"});
    }

    const orders = await Orders.find({sellerId : id},{userId:1,'items.dish':1 ,total:1,createdAt:1,'items.quantity':1,})
    .populate({path: 'items.dish', select: 'dishName -_id'})
    .populate({path:'userId', select: 'name address -_id'});
    res.status(200).json(orders);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message: "Error in fetching dishes", error});
  }
}

module.exports = {
    bookOrders,
    getOrders,
    getOrderedDishes,
}; 