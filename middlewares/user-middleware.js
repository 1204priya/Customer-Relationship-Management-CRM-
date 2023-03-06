const User = require("../models/user-model");
const jwt = require('jsonwebtoken')


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

         user = await User.findOne({email : req.body.email});

        if(user !== null){
            return res.status(400).send(`Email is already registered`);
          }
    
          // check if user filled the name or not
        if(!req.body.name){
         return res.status(400).send(`Name is not provided`);
           }

           //userId validations and checking if userId is unique or not

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
           return res.status(400).send(`userType is incorrect!. user Can Only Signup For ENGINEER | CUSTOMER`);
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
 

  exports.verifyJwtToken = async (req,res,next)=>{
    try{
          const token = req.headers["x-access-token"];
          //const user = await User.findOne({userId:"admin"})
       
        /**
         * check if the token is present
         */
        if(!token){
            return res.status(403).send({
                message:"token is not provided"
            })
        }
        
        /**
         * go and validate the token
         */

         jwt.verify(token , process.env.secret , (err,decoded)=>{
            if(err){
                return res.status(401).send({
                    message:"Unauthorized ! Access is prohibited"
                })
            }

            req.email = decoded.id

            // if(req.email !== user.email){
            //  return res.status(401).send({
            //     message:"only admin user has permission"
            //  })
            // }
            next()
        })
           
    }catch(err){
        console.log("error in verifying jwt token in  middleware ",err);
        res.status(500).send({message:"internal server error"})
    }
  } 


  exports.isAdmin = async (req,res,next)=>{
    try{
        const user = await User.findOne({email:req.email});
        if(user && user.userType == "ADMIN"){
            next()
        }
        else{
            return res.status(403).send({
                message:"only admin can perforn this action"
               })
        }
        

    }catch(err){
        console.log("error in isAdmin middleware",err);
        res.status(500).send({message:"internal server error"})
    }
  }


  exports.isValidUserIdInReqParam = async(req,res,next)=>{
    try{
        //first check if the userId is valid in the req param
        const user = await User.findOne({userId:req.params.userId})

        if(!user){
            return res.status(400).send({
                message:"userId not found"
            })
        } 
    next();
    }catch(err){
        console.log("error in isValidUserid middleware",err.message);
        res.status(500).send({
            message:"internal server error"
        })
    }
  }
     
exports.isAdminOrOwner = async (req,res,next)=>{
    try{
        //Either the caller should be the admin or the owner of that userId
        
        const callingUser = await User.findOne({email:req.email});
        if(callingUser.userType == "ADMIN" || callingUser.userId == req.params.userId){
            next();
        }
        else{
            return res.status(403).send({
                message:"only admin is allowed to  make this call "
            })
        }
        
    }catch(err){
        console.log("error in isAdminOrOwner middleware",err.message);
        res.status(500).send({
            message:"internal server error"
        })
    }
}




