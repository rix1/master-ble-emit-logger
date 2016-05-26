var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
const serialport = require('serialport');

var PORT = 8081;

app.listen(PORT);
console.log('Server listening at http://localhost:' + PORT);

function handler (req, res) {
	console.log('request', req.url);
	res.writeHead(404);
	res.end('Not found');
}

io.on('connection', function (socket) {
	console.log('socket connection established');
	socket.on('timesync', function (data) {
		console.log('message', data);
		socket.emit('timesync', {
			id: data && 'id' in data ? data.id : null,
			result: Date.now()
		});
	});
});

const SerialPort = serialport.SerialPort;
const deviceManufacturer = 'SEGGER';

getPort();
//
// let socket1 = io('http://10.24.20.161:8081');
//
// var ts = timesync.create({
//     server: io(timeSyncServer),
//     interval: 5000
// });
//
// setInterval(function () {
//   var now = new Date(ts.now());
//   // document.write('now: ' + now.toISOString() + ' ms<br>');
// }, 1000);

//
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
        // ts.now();
        console.log('Data: ' + data);
    });
}
