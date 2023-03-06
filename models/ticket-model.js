const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    ticketPriority:{
        type:Number,
        required:true,
        default:4
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type : String,
        required : true,
        default : "OPEN",
        enum : ["OPEN","CLOSE","BLOCKED"]
    },
    reporter:{
        type:String,
        required:true
    },
    assignee:{
        type:String
    },
},{
    timestamps:true
    //versionKey:false
});

module.exports = mongoose.model('ticket',ticketSchema)