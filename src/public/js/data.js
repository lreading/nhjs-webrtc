'use strict';

var peer1, peer2;
var sendChannel, receiveChannel;

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
    startBtn.disabled = true;
    dataChannelSend.placeholder = '';
    var servers = null;
    var pcConstraint = null;
    var dataConstraint = null;

    peer1 = new RTCPeerConnection(servers, pcConstraint);
    sendChannel = peer1.createDataChannel('sendDataChannel', dataConstraint);
    peer1.onicecandidate = function (e) {
        if (!e.candidate) { return; }
        peer2.addIceCandidate(event.candidate); // Promise
    };

    sendChannel.onopen = sendChannelStateChange;
    sendChannel.onclose = sendChannelStateChange;

    // Configure the remote connection
    peer2 = new RTCPeerConnection(servers, pcConstraint);
    peer2.onicecandidate = function (e) {
        if (!e.candidate) { return; }
        peer1.addIceCandidate(e.candidate); // Promise
    };
    peer2.ondatachannel = function (e) {
        receiveChannel = e.channel;
        receiveChannel.onmessage = function (evt) {
            dataChannelReceive.value = evt.data;
        };
    };

    // Create the offer
    peer1.createOffer()
        .then(function (desc) {
            peer1.setLocalDescription(desc);
            peer2.setRemoteDescription(desc);
            peer2.createAnswer()
                .then(function (desc) {
                    peer2.setLocalDescription(desc);
                    peer1.setRemoteDescription(desc);
                });
        });

    stopBtn.disabled = false;
}

/**
 * Sends the data from peer1 to peer2
 */
function send() {
    sendChannel.send(dataChannelSend.value);
    dataChannelSend.value = '';
    dataChannelSend.focus();
}

/**
 * Handles state changes of the send channel
 */
function sendChannelStateChange() {
    if (sendChannel && sendChannel.readyState === 'open') {
        dataChannelSend.disabled = false;
        dataChannelSend.focus();
        sendBtn.disabled = false;
        stopBtn.disabled = false;
    } else {
        dataChannelSend.disabled = true;
        sendBtn.disabled = true;
        stopBtn.disabled = true;
    }
}

/**
 * Closes connections, cleans up and restores default state
 */
function stop() {
    sendChannel.close();
    receiveChannel.close();
    peer1.close();
    peer2.close();
    peer1 = null;
    peer2 = null;
    sendChannel = null;
    receiveChannel = null;
    dataChannelReceive.value = '';
    dataChannelSend.value = '';
    dataChannelSend.disabled = true;
    dataChannelSend.placeholder = 'Press start, enter some text, then press send';
    startBtn.disabled = false;
    sendBtn.disabled = true;
    stopBtn.disabled = true;
}
