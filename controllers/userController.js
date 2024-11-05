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
        const {name, email,phone, address,image,userId, id} = req.body;
        console.log(userId, id);
        const user = await User.findOne({_id:userId}) || await User.findOne({email});
        // console.log(user);
        await User.updateOne({email: user.email},{
          $set:{
            name,
            phone, 
            address,
            image,
          } 
        })
        if(userId){
          const seller = await Seller.findOne({_id:id});
          seller.count = seller.count+1;
          user.favourites.push({_id:id});
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
// const getFavourites = async (req, res) =>{

//   const {id} = req.params;
//   const user = await User.findOne({_id:id}).populate('favourites._id');
//   console.log(user);
//   if(!user){
//     res.status(400).send({message:"user is not found"});
//   }
//   res.status(200).json({data:user, status:"ok"});
// }
const getFavourites = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id })//.populate('favourites'); // Populate the favourites field
    console.log(user);
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    res.status(200).json({ data: user.favourites, status: "ok" });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).send({ message: "Server error" });
  }
};

module.exports = {userDetails,updateProfileController,getFavourites};
 