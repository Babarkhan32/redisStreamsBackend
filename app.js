const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server,{cors: {
    origin: '*',
  }});

var redis = require('redis');
var redisClient = redis.createClient();
  
//Redis Connection and Subscription to redis channel

 redisClient.on('connect',function(){
      redisClient.SUBSCRIBE('events');
  });

 redisClient.on('message',(channel,message)=>{
    io.emit('message',{message});
    })

io.on("connection", (socket) => {

    //Channel data initiation
socket.on('startData',()=>{
redisClient.SUBSCRIBE('events');
})

socket.on('stopData',()=>{
    //Channel Unsubscription and socket disconnection
    redisClient.unsubscribe('events');
    socket.disconnect();
    })
   
})
server.listen(port, () => console.log(`Listening on port ${port}`));