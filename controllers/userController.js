const User = require("../models/User")
const Seller = require('../models/Seller')

const userDetails = async (req,res) =>{
  const id = req.user.userId;
  const user = await User.findOne({_id:id});

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.send(user)
};

const updateProfileController = async (req,res)=>{
    try{
        const {name, email,phone, address,image,userId, restaurantId} = req.body;
        const user = await User.findOne({_id:userId}) || await User.findOne({email});
        await User.updateOne({email: user.email},{
          $set:{
            name,
            phone, 
            address,
            image,
          } 
        })
        if(userId){
          const seller = await Seller.findOne({_id:restaurantId});
          seller.count = seller.count+1;
          user.favourites.push({_id:restaurantId});
          await user.save();
          await seller.save();
          return res.status(200).send({message:'Successfully added to favourite list.'});
        }
        res.status(200).send({status:"ok",message: "Updated successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }

}
const getFavourites = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id })//.populate('favourites'); // Populate the favourites field
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const favourites = await Seller.find({
      _id: { $in: user.favourites },
    });
    res.status(200).send({ status: "ok", data: favourites });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).send({ message: "Server error" });
  }
};


const removeFavorites = async (req, res) => {
  const { userId, restaurantId } = req.body;
  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: restaurantId } }
    );
    const seller = await Seller.findOne({_id:restaurantId});
    seller.count = seller.count-1;
    res.status(204).json({ status: 'ok', message: 'Successfully removed from favourites' });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};


module.exports = {userDetails,updateProfileController,getFavourites,removeFavorites};
 