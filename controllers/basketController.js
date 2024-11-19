const Basket = require('../models/Basket');
const dishes = require('../models/Dishes');

// Add dish to basket
exports.addToBasket = async (req, res) => {
  const { userId, dishId, quantity, sellerId, price } = req.body;
  try {
    let basket = await Basket.findOne({ user: userId });
    const dish = await dishes.findById(dishId);
    if (!basket) {
      basket = new Basket({ user: userId, items: [{ dish: dishId, quantity, price,sellerId}] });
      basket.save();
    } else {
      if(basket && basket.items.length >0 && basket.items[0].sellerId.toString() !== sellerId.toString()){
        return res.status(200).send({message:"cannot be added"})
      }
      else{
        const item = basket.items.find(item => item.dish.toString() === dishId);
        
          if (item) {
            if(item.quantity >= dish.dishQuantity){
          console.log('out of stock')
          return res.send({message:"out of stock"})
        }
            item.quantity += quantity;
      }
        else
           basket.items.push({ dish: dishId, quantity, price,sellerId}); 
        await basket.save();
        res.status(200).send({message:"Successfully added to the basket."}); 
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
// Update basket item quantity
exports.updateBasketItem = async (req, res) => {
  const { userId, dishId, quantity } = req.body;
  try {
    const dish = await dishes.findById(dishId)
    if(dish.dishQuantity>=quantity){
        const basket = await Basket.findOne({ user: userId });
        if (!basket) return res.status(404).json({ message: 'Basket not found' });
        const item = basket.items.find(item => item.dish.toString() === dishId);
        if (item) {item.quantity = quantity};
        await basket.save();
        return res.status(200).json(dish);
    }
    else{
      return res.status(200).json({message:"dish is not available."});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from basket
exports.removeFromBasket = async (req, res) => {
  const { userId, dishId } = req.body; 
  try {
    const basket = await Basket.findOne({ user: userId });
    if (!basket) 
      return res.status(404).json({ message: 'Basket not found' });
    basket.items = basket.items.filter(item => item.dish.toString() !== dishId);
    await basket.save();
    res.status(200).json(basket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch user basket
exports.getBasket = async (req, res) => {
  const { userId } = req.params;
  try {
    const basket = await Basket.findOne({ user: userId }).populate('items.dish');
    if(!basket){
      return res.status(404).json({error:"basket not found"});
    }
    res.status(200).json(basket);
  } catch (error) {
    res.status(500).json({ "server error": error.message });
  }
};
 