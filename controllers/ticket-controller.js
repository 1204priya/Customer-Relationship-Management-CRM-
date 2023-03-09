
const Ticket = require('../models/ticket-model')
const User = require('../models/user-model')

exports.createTicket = async(req,res)=>{
try{

    const ticketObj = {
        title : req.body.title,
        ticketPriority : req.body.ticketPriority,
        description : req.body.description,
        status : req.body.status,
        reporter : req.email
    }

    const engineer = await User.findOne({
        userType:"ENGINEER",
        userStatus:"APPROVED"
    })

    if(engineer){
        ticketObj.assignee = engineer.userId
    }

    const ticketCreated = await Ticket.create(ticketObj);

    if(ticketCreated){
        //update the customer document
           const customer = await User.findOne({
            email : req.email
           });
           customer.ticketsCreated.push(ticketCreated._id);
           await customer.save()
        //update the engineer document
        if(engineer){
            engineer.ticketsAssigned.push(ticketCreated._id)
            await engineer.save()
        }
        res.status(201).send(ticketCreated)
    }
}
catch(err){
    console.log("error in creating ticket",err.message);
    res.status(500).send(
        {
            message:"internal server error"
        }
    )
}
}

exports.getAllUsers = async(req,res)=>{
    try{
        const user = await User.findOne({email:req.email});
        const queryObj = {};

        if(user.userType == "CUSTOMER"){
        // Query for fetching all the tickets created by the users
        

        }
        else if(user.userType == "ENGINEER"){

        }

    }
    catch(err){
        console.log("error in getAllUser ",err);
        res.status(500).send({
            message:"internal server error"
        })
    }
}



