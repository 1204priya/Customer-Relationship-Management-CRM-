const express = require('express');
const {PORT} = require('./configs/server-config')
const mongoose = require('mongoose');
 

const app = express()
app.use(express.json({urlEncoded:{extended:true}}))

mongoose.set('strictQuery', false);
 
mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error',(err)=>{
    console.log("error while connecting to mongodb",err);
});
db.once('open',()=>{
    console.log("successfully connected to mongodb");
})


require('./routes/notification-route')(app)
require('./schedulers/email-scheduler');
const start = async(err)=>{
    if(err){
        console.log(`error while connection to port `);
        process.exit(1)
    }

    app.listen(PORT);
    console.log(`successfully connected to port : ${PORT}`);
}


start()

