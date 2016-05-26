var serialPort = require('serialport');
serialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(`${port.comName} ${port.manufacturer} ${port.pnpId}`);
    console.log();
  });
});
