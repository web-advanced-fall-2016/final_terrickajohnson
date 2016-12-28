var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var port = 8000;
var url='localhost'
var server = app.listen(port);
var io = require("socket.io").listen(server);
var SerialPort = require("serialport");
var port = new SerialPort("/dev/ttyUSB0", {
  baudRate: 115200,
  parser: SerialPort.parsers.readline("\n")
});
var redis = require('redis');
var client = redis.createClient();

app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at '+url+':'+port);

// socket.io stuff
io.sockets.on('connection', function (socket) {
  socket.on('news', function (data) {
    console.log(data);
    //console.log("You sent R=" + data.r + " G="+ data.g + " B="+ data.g);
    socket.emit('news', { hello: data });     

  });
});

var result = "";
var brightness = 0;
var r = 0;
var g = 0;
var b = 0;

client.on('connect', function(){
  console.log('connected')
})

client.hmset('MyData', {
  'woop': 'woooop'
});

////GET HASH
client.hgetall('MyData', function(err, object) {
    console.log(object);
});

var comingIn;

io.sockets.on('connection',function(socket){
  
        port.on('data', function(data){

            // console.log(data);
            result = data.split('\n');


            // console.log("Success")
            
              socket.emit('connection', function(data){
                //console.log(result);
              });

              socket.emit('led', {value: result[0]});

              //io.sockets.emit('led', {value: result[0]});

        });


        socket.on('column1color', function(data){
            // client.hmset('MyData', 
            //     {result: data.result1}
            //   )

            client.exists('MyData', function(err, reply){
                if(reply){
                  // client.hmset('MyData',
                  //   {comingIn: data.result1}
                  // )
                  console.log(data)
                } else {
                  console.log("error");
                }

            })

        })



});




io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
});

io.sockets.on('connection', function (socket) {
        socket.emit('message', 'You are connected!');
        port.on('data', function(data){
          // socket.emit
        })
});



// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})