// node.js client

if (typeof global.Promise === 'undefined') {
  global.Promise = require('promise');
}
var timesync = require('timesync');

// create a timesync client
var ts = timesync.create({
  peers: 'http://129.241.102.116:8123',
  interval: 5000
});

// get notified on changes in the offset
ts.on('change', function (offset) {
  console.log('changed offset: ' + offset + ' ms');
});

// get synchronized time
setInterval(function () {
  var now = new Date(ts.now());
  console.log('remote: ' + ts.now() + ' local: ' + Date.now();
}, 1000);