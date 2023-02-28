
const {Kafka} = require('kafkajs');


const clientId = 'Priyanka';
const brokers = ["localhost:9092"];
const topic = 'tata-sky';

const kafka = new Kafka({brokers,clientId});

const producer = kafka.producer();

exports.produce = async(user , message)=>{
    try{

        await producer.connect()

        await producer.send({
            topic,
            messages:[{
                value : `${message}:${user}`
            }]
        });

        console.log("from producer");

    }catch(err){
        console.log("error in kafka");
    }
}













