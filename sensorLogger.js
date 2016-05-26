const timesync = require('timesync');
const serialport = require('serialport');

const SerialPort = serialport.SerialPort;
const deviceManufacturer = 'SEGGER';
const timeSyncServer = 'http://10.24.20.161:8081';

if (typeof global.Promise === 'undefined') {
    global.Promise = require('promise');
}


// create a timesync client syncing time every 10 seconds
let ts = timesync.create({
    peers: timeSyncServer,
    interval: 10000
});

// get notified on changes in the offset
ts.on('change', function (offset) {
    console.log('changed offset: ' + offset + ' ms');
});

ts.on('sync', function (state) {
    console.log('sync', state);
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
        console.log(ts.now(),'Data:',data);
    });
}
