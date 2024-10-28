const express = require('express');
const db = require('./config/db.js');
const AuthRoute = require('./Routes/authRoutes.js');
const userRoute = require('./Routes/userRoutes.js');
const adminRoute = require('./Routes/adminRoutes.js');
const sellerRoute = require('./Routes/sellerRoutes.js');
const basketRoutes = require('./Routes/basketRoutes.js');
const ordersRoute = require('./Routes/ordersRoute.js');
const app = express();
app.use(express.json())

app.get('/',(req,res)=>{
    res.status(200).json({response:'welcome'});
})
app.use('/',AuthRoute)
app.use('/',userRoute)
app.use('/',adminRoute)
app.use('/',sellerRoute)
app.use('/basket',basketRoutes);
app.use('/',ordersRoute);
const PORT =  8080;
app.listen(PORT, ()=>console.log(`Server is running at port:${PORT}`)); 