const cron = require('node-cron')
const {transporter} = require('../notifiers/email-service')
const Notification = require('../models/notification-model')

cron.schedule(" */30 * * * * * ",async()=>{

    const notification = await Notification.find({status : "UN_SENT"});

    if(notification ){
        console.log("all notification count are",notification.length);

        // send mail to each notification request
        notification.forEach((n)=>{
            mailObj = {
                to : n.recepientEmails,
                subject : n.subject,
                text : n.content
             };
             console.log("sending mail for ",mailObj);

             transporter.sendMail(mailObj,async(err,info)=>{
                if(err){
                    console.log("error while sending email",err);
                }
                console.log("email sent successfully",info);
                n.status = "SENT";
                await n.save();
            });
        })
    }
    
})






























