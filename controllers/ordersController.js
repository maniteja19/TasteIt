const User = require('../models/User');
const Orders = require('../models/Orders')
const bookOrders = async (req,res) =>{
    const {basket} = req.body;
    try{
        const newOrder = new Orders({
            sellerId: basket.items[0].dish.seller,
            userId: basket.user,
            items:basket.items,
        })
        await newOrder.save();
    }
    catch(error){
        console.log(error);
        res.status(500).json({"error": error});
    }
}
// const getOrders = async (req,res) =>{
//     const id = req.user.userId;
//     try {
//         const user = await User.findOne({_id:id});    
//         if (!user) {
//             return res.status(404).json({ message: 'user not found' });
//         }
//         const order= await Orders.find({userId:id}).populate('items.dish').populate('sellerId');
//         console.log(order);
//         res.status(200).json(order);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching orders', error });
//     }
// }
const getOrders = async (req, res) => {
  const id = req.user.userId;
  try {
    // Find the user by id
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find orders and populate nested fields
    const orders = await Orders.find({ userId: id })
      .populate({ path: 'items.dish' })  // Populate each dish inside items
      .populate('sellerId');             // Populate sellerId

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};


module.exports = {
    bookOrders,
    getOrders
}; 