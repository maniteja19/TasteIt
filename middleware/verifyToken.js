const jwt = require('jsonwebtoken');
const JWT_SECRETKEY = "secretkey";

const verifyToken = (req,res,next) =>{
    const userToken = req.header('Authorization');
    
    if(!userToken){
        return res.status(400).send({message:"not authorized,pass token"})
    }
    try{
        const token = userToken.split(" ")[1]
        const decoded = jwt.verify(token, JWT_SECRETKEY);
        req.user = decoded;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(500).send({message:"server is not responding"});
    }
}

module.exports = verifyToken;