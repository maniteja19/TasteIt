const User = require('../models/User');
const Seller = require('../models/Seller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRETKEY = "secretkey";

const RegisterController = async (req,res)=>{
    const {name, email, phone, password,} = req.body;
    try{
        const user = await User.findOne({email})
        if(user){
            return res.json('User already exist. Please Login')
        }
        const encryptedPassword = await bcrypt.hash(password,10);
        
        await User.create({
        name: name,
        email: email, 
        phone,
        password : encryptedPassword,
        role:'customer',
    })
    return res.status(201).json({
        message: "User successfully registered to app",
        "status":"ok"})
    }
    catch(error){
        res.status(500).json({
            "status":"failed",
            "error" : error,
        })
        console.log(error);
    }   
};

const LoginController = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user =  await User.findOne({email}) || await Seller.findOne({email});
        if(!user){
            return res.status(400).json({status:'error',message:'Incorrect email'})
        }
        const decodedPassword = await bcrypt.compare(password,user.password);
        if(!decodedPassword){
            return res.status(400).json({status:'error',message:'Incorrect Password'});
        }
        const token = jwt.sign({userId: user._id, role : user.role},JWT_SECRETKEY);
        res.status(200).json({status:'Ok',data:token, role : user.role, Status : user.status, userId: user._id});
    
    }catch(err){
        res.status(500).json("server is not responding.");
    }
    
}

const registerSellerController = async (req, res) => {
  try {
    const { name, email, restaurantName,password,phoneNumber} = req.body;
    const seller = await Seller.findOne({email})
    if(seller){
        return res.json('User already exist. Please Login')
    }
    const encryptedPassword = await bcrypt.hash(password,10);

    const newSeller = new Seller({
      name,
      restaurantName,
      email,
      phoneNumber,
      password: encryptedPassword,
      role:'seller',
    });

    await newSeller.save();

    return res.status(201).json({
        message: "User successfully registered to app",
        "status":"ok"});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "error",
    });
  }
};

module.exports = {
    RegisterController,
    LoginController,
    registerSellerController,
}