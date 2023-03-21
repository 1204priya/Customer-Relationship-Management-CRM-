const express = require('express');
const {PORT} = require('./configs/server-config')

const app = express()

app.use(express.json({urlEncoded:{extended:true}}))


require('./routes/notification-route')(app)
const start = async(err)=>{
    if(err){
        console.log(`error while connection to port `);
        process.exit(1)
    }

    app.listen(PORT);
    console.log(`successfully connected to port : ${PORT}`);
}


start()

