const Ticket = require('../models/ticket-model');
const User = require('../models/user-model')

exports.isValidOwnerOfTheTicket = async(req,res,next)=>{
    const user = await User.findOne({email:req.email});
    const ticket = await Ticket.findOne({_id : req.params.id});

    if(user.userType == "CUSTOMER" ){
        const reporter = ticket.reporter;
        if(user.userId != reporter){
            return res.status(403).send({
                message:" only ADMIN | OWNER | ASSIGNED ENGINEER is allowed"
            })
        }
       
    }
    else if(user.userType == "ENGINEER"){

       const reporter = ticket.reporter ; 
       const assignee = ticket.assignee ;

       if(user.userId !== reporter && user.userId !== assignee){
        return res.status(403).send({
            message:" only ADMIN | OWNER | ASSIGNED ENGINEER is allowed"
        })
       }
       
    };

    /**
     * if the update required the change in the assignee
     * 
     * only admin should be  aalowed to do this change
     * assignee should be a valid engineer
     */

    if(req.body.assignee != undefined && user.userType != "ADMIN"){
        return res.status(403).send({
            message:" only ADMIN is allowed to reassign the ticket"
        })
    }

    if(req.body.assignee != undefined){
        const engineer = await User.findOne({userId : req.body.assignee})

     if(engineer == null){
        return res.status(401).send({
            message: "Engineer userId passed as assignee is wrong"
        })
     }
    }
    

next();
}












