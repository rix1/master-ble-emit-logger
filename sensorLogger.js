// const serialport = require('serialport');
const timesync  = require('timesync/server');
const io = require('socket.io-client');

// const SerialPort = serialport.SerialPort;
const deviceManufacturer = 'SEGGER';
const timeSyncServer = 'http://10.24.20.161:8081';

let started = false;

// getPort();

let socket1 = io('http://10.24.20.161:8081');

var ts = timesync.create({
    server: io(timeSyncServer),
    interval: 5000
});

setInterval(function () {
  var now = new Date(ts.now());
  // document.write('now: ' + now.toISOString() + ' ms<br>');
}, 1000);

//
// function getPort(callback){
//
//     serialport.list(function (err, ports) {
//         ports.forEach(function(port) {
//             if(port.manufacturer === deviceManufacturer){
//                 connectToPort(port.comName);
//             }
//         });
//     });
// }
//
// function connectToPort(portName){
//     console.log(`Listening on port ${portName}....`);
//     var port = new SerialPort(portName, {
//         parser: serialport.parsers.readline('\n')
//     });
//
//     port.on('data', function (data) {
//         // ts.now();
//         console.log('Data: ' + data);
//     });
// }
