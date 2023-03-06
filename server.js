


const express = require("express");
const { PORT } = require("./configs/server-config");
const mongoose = require('mongoose');
const User = require("./models/user-model");

const bcrypt = require('bcryptjs')

const app = express();
app.use(express.json({urlencoded : {extended : true}}));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.mongo);
const db = mongoose.connection;  

db.on('error', (err) => { 
    console.log(`error while connecting db ${err}`);
});
 
db.once('open', () => {
    console.log(`connected to mongodb successfully`);
    init();
})
 

const init = async() =>{
    try{
        //await User.collection.drop()
     const user = await User.findOne({userId:"admin"});

        if(user){
        console.log(`Admin is already present`); 
        console.log(user);
         }
     else{

    const admin = await User.create({
      userId:"admin", 
      name : "Priyanka", 
      email : "str.priyanka@gmail.com",
      password : bcrypt.hashSync("Priyanka@1",8),  
      userType : "ADMIN" 
     });
      
     console.log(`Admin has been created ${admin}`);   
 }}catch(err){ 
    console.log("error",err);  

 }
 
}  
 

require("./routes/user-route")(app);


const start = async(err) => {  
    if(err){
        console.log(`error while connecting server ${err}`);
    }
    await app.listen(PORT);
    console.log(`server connected successfully on PORT ${PORT}`);
}

start();






















