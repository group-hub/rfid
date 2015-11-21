var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var http = require('http');
var camera = require('camera-vc0706').use(tessel.port['D']);

var rfid = rfidlib.use(tessel.port['A']);

var wifi = require('wifi-cc3000');
var network = "John's iPhone"
var password = process.env.WIFI_PASSWORD;
var security = 'wpa2';

// Connect to the wifi
if (!wifi.isConnected()) {
  connect();
}

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
    console.log('UID:', card.uid.toString('hex'));
    camera.takePicture(function(err, image) {
      if (err) {
        console.log('error taking image', err);
      } else {
        // Name the image
        var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
        // Save the image
        console.log('Picture saving as', name, '...');
        process.sendfile(name, image);
        console.log('done.');
      }
    });
  });
});

rfid.on('error', function (err) {
  console.error(err);
});

/**
* Connect to wifi
*/
function connect(){
  wifi.connect({
  security: security
  , ssid: network
  , password: password
  , timeout: 30
  });
}
