const Seller = require("../models/Seller");
const Dish = require('../models/Dishes');
const RestaurantDetails = async (req,res) =>{
  const id = req.user.userId;
  const seller = await Seller.findOne({_id:id});

  if (!seller) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.send(seller)
};
const updateSellerController = async (req,res) => {
    try{
        const {phone, address, photo,email}  = req.body;
        const user = await Seller.findOne({email});
        if(!user){
            return res.status(400).send({message: 'user not found'});
        }
        await Seller.updateOne({email:user.email},{
            $set:{
                phoneNumber:phone,
                address,
                photo,
            }
        })
        res.status(200).send({message:'successfully updated'});
    }
    catch(err){
        console.log(err);
        res.send({message: "error"})
    }
}
const restaurantsController = async (req,res) => {
    try{
        const user = await Seller.find({status:'approved'})
        
        res.status(200).send({status:"ok", data:user});
    }
    catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
    }
}
const deleterestaurantController = async (req,res) =>{
    try{
        const restaurantId = req.params.id;
        const response = await Seller.findById(restaurantId);
        if(!response){
            return res.status(404).send({message : "restaurant not found"});
        }
        response.status = "rejected"
        await response.save();
        res.status(204).send({message: "successfully deleted", Status: "Success"});
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const addDishes = async(req,res) =>{
    const {id} = req.params;
    const {dishName, dishDescription, dishPrice, dishType, dishQuantity} = req.body;
    try{
        const newDish = new Dish({
            dishName,
            dishQuantity,
            dishDescription,
            dishPrice,
            dishType,
            seller: id,
        });
        await newDish.save();

        const seller = await Seller.findOne({_id:id});
        if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
        }

        seller.dishes.push(newDish._id);
        await seller.save();
        res.status(201).send({status:"ok",message:"Dish added successfully",dish:newDish});
    }
    catch(error){
        console.error('Error adding dish:', error);
        res.status(500).json({ message: 'Error adding dish', error });
    }

}
const getDishes = async(req,res) =>{
    const { id } = req.params;
    try {
        const seller = await Seller.findOne({_id:id}).populate('dishes');       
        if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
        }

        res.status(200).json({ dishes: seller.dishes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dishes', error });
    }
}

const deleteDishes = async (req,res) =>{
    const {sellerId, dishId} = req.params;
    try{
        await Dish.findByIdAndDelete(dishId);
        const seller = await Seller.findOne({_id:sellerId});
        seller.dishes.pull(dishId);
        await seller.save();
        res.status(204).json({message:"dish removed successfully",status:"ok"});
    }
    catch(error){
        console.log("Deletion error",error);
        res.status(500).json({message:error});
    }
}

module.exports = {
    restaurantsController,
    deleterestaurantController,
    addDishes,
    getDishes,
    deleteDishes,
    RestaurantDetails,
    updateSellerController
}; 