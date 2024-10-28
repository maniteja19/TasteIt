const User = require("../models/User")

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
            user.favourites.push({_id:id});
            await user.save();
            return res.status(200).send({message:'Successfully added to favourite list.'});
        }
        res.status(200).send({status:"ok",message: "Updated successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }

}
module.exports = {userDetails,updateProfileController};
