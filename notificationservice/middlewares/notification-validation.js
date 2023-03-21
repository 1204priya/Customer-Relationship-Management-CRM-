



exports.createNotificationValidations = async (req,res,next)=>{
    try{
        if(!req.body.subject){
            return res.status(500).send({
                message:"subject field can't be empty"
            })
        }

        if(!req.body.recepientEmails){
            return res.status(500).send({
                message:"recepient field can't be empty..please provide one"
            })
        }

        if(!req.body.content){
            return res.status(500).send({
                message:"content field can't be empty..please provide content for the email"
            })
        }

        next()

    }
    catch(err){
        console.log("error in createnotification middleware",err);
        res.status(500).send("internal server error")
    }
}










