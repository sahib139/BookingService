const amqplib = require("amqplib");
const {MESSAGE_BROKER_URL,EXCHANGE_NAME,REMINDER_BINDING_KEY,BOOKING_BINDING_KEY} = require("../../config/server-config");

let connection,channel;

const CreateChannel = async ()=>{
    try {
        connection = await amqplib.connect(MESSAGE_BROKER_URL);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,'direct',false);
        return channel;
    } catch (error) {
        throw error;
    }
}

const publishMessage = async (binding_key,message)=>{
    try {
        await channel.assertQueue('REMINDER_QUEUE');
        await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const subscribeMessage = async (binding_key)=>{
    try {
        const q=await channel.assertQueue('BOOKING_QUEUE');
        await channel.bindQueue(q.queue,EXCHANGE_NAME,binding_key);
        await channel.consume(q.queue,(msg)=>{
            const content = msg.content.toString();
            console.log(content);
            channel.ack(msg);
        });
    } catch (error) {
        throw error;
    }
}

module.exports={
    CreateChannel,
    publishMessage,
    subscribeMessage,
}
