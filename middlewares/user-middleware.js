const User = require("../models/user-model");


exports.signupMw = async(req,res,next) => {
    try{  
         let user ;
        // for email validations 
        if(!req.body.email){
            return res.status(400).send(`Email cant be empty`);
        }

        if(!isValidEmail(req.body.email)){
            return res.status(400).send(`failed ! invalid email id`);
        }

         user = await User.findOne({email : req.body.email,userId:req.body.userId});

        if(user !== null){
            return res.status(400).send(`Email is already registered`);
          }
    
          // check if user filled the name or not
        if(!req.body.name){
         return res.status(400).send(`Name is not provided`);
           }

           //userId validations
           //checking if userId is unique or not

           user = await User.findOne({userId : req.body.userId});

           if(user !== null){
            return res.status(500).send("userId is already taken..please use another one")
           }

           if(!req.body.userId){
            return res.status(500).send(`userId cant be empty`)
           }

           //checking userId cant be admin 
           if(req.body.userId === "admin"){
            return res.status(400).send(`userId cannot be admin for security purpose`);
            }

            
           // usertype validations 

            if(!req.body.userType){
                return res.status(400).send(`UserType is not provided`);
            }
     

           const userTypes = ["CUSTOMER","ENGINEER"]

           if(!userTypes.includes(req.body.userType)){
             return res.status(400).send(`UserType cant be other than ENGINEER CUSTOMER `);
           }  
         
          if(req.body.userType === "ADMIN" ){
           return res.status(400).send(`User Can Only Signup For ENGINEER | CUSTOMER`);
          }

          // password validations  
          if(!req.body.password){
          return res.status(400).send(`Password should be provided`);
          }

 next();
 
}catch(err){
    res.status(500).send(`error in signupMw`);
}
}

const isValidEmail = (email)=>{
    return String(email).toLowerCase().
    match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

exports.signinMw = async(req,res,next) => {

    try{

    
    if(!req.body.email){
    return res.status(400).send(`Email is must for signin`);
    }
   
    if(!req.body.password){
        return res.status(400).send(`Password is must for signin`);
    }
    

   next();

}catch(err){
    res.status(500).send(`error in signinMw ${err}`);
}
}