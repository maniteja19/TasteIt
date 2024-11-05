const Basket = require('../models/Basket');

// Add dish to basket
exports.addToBasket = async (req, res) => {
  const { userId, dishId, quantity, sellerId, price } = req.body;
  try {
    let basket = await Basket.findOne({ user: userId });
    if (!basket) {
      basket = new Basket({ user: userId, items: [{ dish: dishId, quantity, price}] });
      basket.save();
    } else {
        const item = basket.items.find(item => item.dish.toString() === dishId);
        if (item) 
            item.quantity += quantity;
        else
           basket.items.push({ dish: dishId, quantity, price}); 
        await basket.save();
        res.status(200).send({message:"Successfully added to the basket."}); 
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
// Update basket item quantity
exports.updateBasketItem = async (req, res) => {
  const { userId, dishId, quantity } = req.body;
  try {
    const basket = await Basket.findOne({ user: userId });
    if (!basket) return res.status(404).json({ message: 'Basket not found' });
    const item = basket.items.find(item => item.dish.toString() === dishId);
    if (item) item.quantity = quantity;
    await basket.save();
    res.status(200).json(basket);
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
    console.log(basket.items);
    basket.items = basket.items.filter(item => item.dish.toString() !== dishId);
    console.log(basket.items);
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
    console.log(basket);
    if(!basket){
      return res.status(404).json({error:"basket not found"});
    }
    res.status(200).json(basket);
    // console.log(basket);
  } catch (error) {
    res.status(500).json({ "server error": error.message });
  }
};
 