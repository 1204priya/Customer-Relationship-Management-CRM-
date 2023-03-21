

// controller to create notification 

const notificationModel = require("../models/notification-model");

exports.acceptNotificationRequest = async(req,res)=>{
    try{
        const notificationObj ={
            subject : req.body.subject,
            recepientEmails : req.body.recepientEmails,
            content : req.body.content,
            requester : req.body.requester,
            status : req.body.status
        }

        const notification = await notificationModel.create(notificationObj);

        res.status(201).send({
            message : "your request is accepted , here is your tracking id",
            _id : notification.id
        })

    }catch(err){
        console.log("error in acceptiNotificationRequest in notification controller");
        res.status(500).send("Internal Server Error")
    }
}



//controller to fetch the notification based on notification id



exports.getNotifications = async (req,res)=>{
    try{
        const notifications = await notificationModel.find()
        res.status(200).send(notifications)

    }
    catch(err){
        console.log("error in getNotifications in notification controller");
        res.status(500).send("Internal Server Error")
    }
}















