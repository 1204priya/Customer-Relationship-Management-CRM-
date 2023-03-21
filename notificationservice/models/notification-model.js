
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    recepientEmails:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    requester:{
        type:String
    },
    status:{
        type:String,
        default :"UN_SENT",
        enum:["SENT","UN_SENT"]
    }
},{
    timestamps:true,
    versionKey:false
});

module.exports = mongoose.model("notification",notificationSchema)
