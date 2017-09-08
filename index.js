'use strict';
var osc = require('node-osc');

//var client = new osc.Client('127.0.0.1', 8900);
var client = new osc.Client('192.168.100.62', 8900);

var msg = {
    address: '/TimeValue',
    args: [
        {type: 'float', value: 37808},
        {type: 'float', value: 224}
    ]
};

let counter=0;
const SNS_SEND_INTERVAL = 17; //17;
let lastSNSSendTime = (new Date).getTime();
let startTime = 0;

const loop = () => {
    const now = (new Date).getTime();
    if (startTime == 0) {
        startTime = now;
    }
    if (now - lastSNSSendTime >= SNS_SEND_INTERVAL) {
        msg.args[0].value = now - startTime;
        msg.args[1].value = counter;
        client.send(msg, function (err) {
            if (err) {
                console.error(new Error(err));
            }
            //client.kill();
        });
        lastSNSSendTime = now;
        counter = (counter + 1) % 1000;
    }
    setImmediate(loop);
}
loop();
