'use strict';

var constraints = {
    audo: false,
    video: {
        height: 450,
        width: 500
    }
};

navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
        document.getElementById('helloVid').srcObject = stream;
    }).catch(function (error) {
        console.error('Error getting stream: ', error);
    });
