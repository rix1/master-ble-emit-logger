const timesync = require('timesync');
const serialport = require('serialport');
const DDPClient = require("ddp");

const SerialPort = serialport.SerialPort;
const deviceManufacturer = 'SEGGER';
const timeSyncServer = 'http://129.241.102.116:8123';
const meteorServer =   'ws://129.241.102.116:3000/websocket'

var meteorConnected = false;

if (typeof global.Promise === 'undefined') {
    global.Promise = require('promise');
}

var ddpclient = new DDPClient({
    autoReconnect : true,
    autoReconnectTimer : 30,
    maintainCollections : true,
    ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
    url: meteorServer
});

ddpclient.connect(function(error, wasReconnect) {
    // If autoReconnect is true, this callback will be invoked each time
    // a server connection is re-established
    if (error) {
        console.log('DDP connection error!');
        console.log(error);
        meteorConnected = false;
        return;
    }
    if (wasReconnect) {
        console.log('Reestablishment of a connection.');
    }
    meteorConnected = true;
    console.log('connected!');
});

// ddpclient.on('message', function (msg) {
//     console.log("ddp message: " + msg);
// });

// create a timesync client syncing time every 5 seconds
let ts = timesync.create({
    peers: timeSyncServer,
    interval: 5000
});

// get notified on changes in the offset
ts.on('change', function (offset) {
    console.log('changed offset: ' + offset + ' ms');
});

ts.on('sync', function (state) {
    console.log('sync', state);
});

ts.send = function (socket, data) {
  console.log('send', data);
  socket.emit('timesync', data);
};
//
ts.on('timesync', function (data) {
  console.log('receive', data);
  ts.receive(null, data);
});

getPort();

function getPort(callback){

    serialport.list(function (err, ports) {
        ports.forEach(function(port) {
            if(port.manufacturer === deviceManufacturer){
                connectToPort(port.comName);
            }
        });
    });
}

function connectToPort(portName){
    console.log(`Listening on port ${portName}....`);
    var port = new SerialPort(portName, {
        parser: serialport.parsers.readline('\n')
    });

    port.on('data', function (data) {
        console.log(ts.now(),'Data:',data,'currentTime:', Date.now());
        let msg = {
            msg_id: data,
            timestamp: ts.now(),
            eventtype: 'send',
            client_id: 'ble_node'
        }
        registerBLEmessage(msg)
    });
}

function registerBLEmessage(message){
    if(meteorConnected){
        ddpclient.call(
            'registerEvent',               // name of Meteor Method being called
            [message],                            // parameters to send to Meteor Method
            function (err, result) {            // callback which returns the method call results
                // err & console.log(err);
                // console.log(result);
            },
            function () {                       // callback which fires when server has finished
                // console.log('server has finished');  // sending any updated documents as a result of
            }
        );
    }else{
        console.error("Could not registerBLEmessage - Meteor not connected");
    }
}
