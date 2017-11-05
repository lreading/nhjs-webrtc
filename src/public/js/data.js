'use strict';

var peer1, peer2;

var startBtn = document.getElementById('startBtn');
var sendBtn = document.getElementById('sendBtn');
var stopBtn = document.getElementById('stopBtn');
var dataChannelSend = document.getElementById('dataChannelSend');
var dataChannelReceive = document.getElementById('dataChannelReceive');

sendBtn.disabled = true;
stopBtn.disabled = true;

startBtn.onclick = start;
sendBtn.onclick = send;
stopBtn.onclick = stop;

/**
 * Creates the WebRTC connection
 */
function start() {
    dataChannelSend.placeholder = '';
    var servers = null;
    var pcConstraint = null;

    peer1 = new RTCPeerConnection(servers, pcConstraint);

}
