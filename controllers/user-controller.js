const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {showData} = require('../utils/data-map')
const {produce} =require('../utils/kafka')

const redis = require('redis');
const client = redis.createClient();
const key = 'newData';
const field = 'data';
let arr = [];

const startRedis = async(err) => {
    if(err){
        console.log(`error while connecting redis`);
    }
    await client.connect();
    console.log(`redis connected successfully`);
}
startRedis();

 


exports.signup = async(req,res) => {
    try{

        if(req.body.userType !== "CUSTOMER"){
            req.body.userStatus = "PENDING"
        }

     const userObj = {
     userId:req.body.userId,
     name : req.body.name,
     email : req.body.email,
     password : bcrypt.hashSync(req.body.password,6),
     userType : req.body.userType,
     userStatus : req.body.userStatus
    }
     
    const userCreated = await User.create(userObj);     

    
     let data = showData(userCreated)
     arr.push(data);

     await client.hSet(key,field,JSON.stringify(arr));
     console.log(`added new user to redis`);
     
    let msg = "new user added"
    produce(userCreated , msg) 
    res.status(201).send(data);  

    }catch(err){
        res.status(500).send(`error while signup ${err}`);
    }

}


exports.signin = async(req,res) => {
    try{

    const user = await User.findOne({email : req.body.email});

    if(user === null){
        return res.status(400).send(`user is not registered`);
    }

    //check if the user status is in pending state
    if(user.userStatus=="PENDING"){
        return res.status(400).send(`not yet approved from the admin`);
    }
    const validPass = bcrypt.compareSync(req.body.password,user.password);

    if(!validPass){
        return res.status(400).send(`password is incorrect`);
    }

    const token = jwt.sign({ 
        id : user.email
    },process.env.secret,{
        expiresIn : 600
    });

    const response = {
        mongoId : user.id,
        userId : user.userId,
        name : user.name,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus, 
        createdAt : user.createdAt,
        updatedAt : user.updatedAt,
        accessToken : token
    }

    res.status(200).send(response);
}catch(err){ 
    res.status(500).send(`error while signin ${err}`);
}

}

exports.findData = async(req,res) => {
    try{
        
        let userStatusQ = req.query.userStatus;
        let userTypeQ = req.query.userType
        let user;
        
         const getRedisData = await client.hGet(key,field); 
        

        if(userStatusQ){
            user = await User.find({userStatus : userStatusQ})
        }
        else if(userTypeQ){
            user = await User.find({userType : userTypeQ})
        }
        else if(getRedisData){
            user = JSON.parse(getRedisData);
            console.log(`got data from redis`);
          }
        else{
        user = await User.find();
        
      }
    
        res.status(200).send(user.map((data) => {
        return{
        mongoId : data.id,
        userId : data.userId, 
        name : data.name, 
        email : data.email,
        userType : data.userType,
        userStatus : data.userStatus,
        createdAt : data.createdAt,
        updatedAt : data.updatedAt

        }})); 

    }catch(err){
   res.status(500).send(`error in finding data ${err}`);
    }
}

exports.findWithId = async(req,res) => {
    try{
   const user = await User.findOne({userId : req.params.userId});
   let response = showData(user)
   res.status(200).send(response) 


    }catch(err){
        res.status(500).send(`error while findWithId ${err}`);
    }
}

exports.updateData = async(req,res) => {
    try{
        const user = await User.findOne({userId : req.params.userId});

        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email ? req.body.email : user.email;
        user.password = req.body.password ? bcrypt.hashSync(req.body.password) : user.password;
        user.userStatus = req.body.userStatus ? req.body.userStatus : user.userStatus;
        user.userType = req.body.userType ? req.body.userType : user.userType;

        const data = await user.save();
       
        res.status(201).send(showData(data));

    }catch(err){
   res.status(500).send(`error while updating data ${err}`);
    }   
}

exports.deleteData = async(req,res) => {
    try{

    await User.deleteOne({userId : req.params.userId});
    
    
    res.status(200).send(`user deleted successfully`);

    }catch(err){
        res.status(500).send(`error while deleting data ${err}`);  
    }
   
}