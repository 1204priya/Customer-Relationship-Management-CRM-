
const Ticket = require('../models/ticket-model');
const User = require('../models/user-model');

exports.createTicket = async(req,res)=>{
try{

    const ticketObj = {
        title : req.body.title,
        ticketPriority : req.body.ticketPriority,
        description : req.body.description,
        status : req.body.status,
        reporter : req.email
    };

    const engineer = await User.findOne({
        userType:"ENGINEER",
        userStatus:"APPROVED"
    });

    if(engineer){
        ticketObj.assignee = engineer.userId
    };

    const ticketCreated = await Ticket.create(ticketObj);

    if(ticketCreated){
        //update the customer document
           const customer = await User.findOne({
            email : req.email
           });
           customer.ticketsCreated.push(ticketCreated._id);
           await customer.save();
        //update the engineer document
        if(engineer){
            engineer.ticketsAssigned.push(ticketCreated._id);
            await engineer.save();
        };
        res.status(201).send(ticketCreated);
    }
}
catch(err){
    console.log("error in creating ticket",err.message);
    res.status(500).send(
        {
            message:"internal server error"
        }
    );
};
}

exports.getAllUsers = async(req,res)=>{
    try{
        const user = await User.findOne({email:req.email});
        const queryObj = {};
        const reporter = user.ticketsCreated;
        const assignee = user.ticketsAssigned;

        if(user.userType == "CUSTOMER"){
        // Query for fetching all the tickets created by the users
        
          if(!reporter){
            return res.status(200).send(`no tickets are created by user`);
          }

          queryObj['_id']= {$in : reporter };

        }
        else if(user.userType == "ENGINEER"){
               queryObj['$or'] = [{'_id':{$in : reporter}},{'_id': {$in : assignee}}];
        };

        const getTickets = await User.find(queryObj);

        res.status(200).send(getTickets);

    }
    catch(err){
        console.log("error in getAllUser ",err);
        res.status(500).send({
            message:"internal server error"
        });
    };
}


exports.updateTicket = async (req,res)=>{
    try{
        const ticket = await Ticket.findOne({"_id":req.params.id});

        ticket.title = req.body.title != undefined ? req.body.title : ticket.title ;
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description ;
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority ;
        ticket.status = req.body.status != undefined ? req.body.status : title.status ;
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : title.assignee ;

        const updatedTicket = await ticket.save();

        res.status(200).send(updatedTicket)
        
    }
    catch(err){
        console.log("error in updating user ",err);
        res.status(500).send({
            message:"internal server error"
        });
    }
}

















































