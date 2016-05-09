var awsIot = require('aws-iot-device-sdk');
var Chance = require('chance');
    chance = new Chance();

var pattern = /#####/g;

var device = awsIot.device({
privateKey: new Buffer(process.env.AWS_PRIVATE_KEY.replace(pattern, '\n')),
clientCert: new Buffer(process.env.AWS_CERT.replace(pattern, '\n')),
    // caCert: new Buffer(process.env.AWS_ROOT_CA.replace(pattern, '\n\r')),
    caPath: "/data/rootCA.pem",
  clientId: process.env.RESIN_DEVICE_UUID,
    region: process.env.AWS_REGION
});

device.on('connect', function() {
  console.log('connect');
  device.subscribe('topic_1');

  // publish data every second
  setInterval(function () {
    var bool = chance.bool({likelihood: 30});
    device.publish('topic_1', JSON.stringify({ test_data: bool }));
  }, 3000);
});

device.on('message', function(topic, payload) {
  console.log('message', topic, payload.toString());
});
