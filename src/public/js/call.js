/**
 * Creates a local video stream and a mocked peer connection (using the same stream)
 */
'use strict';

var localStream, peer1, peer2;

var startBtn = document.getElementById('startBtn');
var callBtn = document.getElementById('callBtn');
var hangupBtn = document.getElementById('hangUpBtn');
var localVid = document.getElementById('localVideo');
var remoteVid = document.getElementById('remoteVideo');
var streamConstraints = {
    audio: false,
    video: true
};
var offerConstraints = {
    offerToReceiveAudio: 0,
    offerToReceiveVideo: 1
};

// Set the initial state and handlers for the buttons
callBtn.disabled = true;
hangupBtn.disabled = true;
startBtn.onclick = start;
callBtn.onclick = call;
hangupBtn.onclick = hangup;

/**
 * Starts the local stream
 */
function start() {
    startBtn.disabled = true;
    navigator.mediaDevices.getUserMedia(streamConstraints)
        .then(function (stream) {
            localVid.srcObject = localStream = stream;
            callBtn.disabled = false;
        }).catch(function (e) {
            console.error('Error getting local stream', e);
            startBtn.disabled = false;
        });
}

/**
 * Starts the mocked call.
 * This is where the WebRTC APIs start to come into play
 */
function call() {
    callBtn.disabled = true;
    hangupBtn.disabled = false;

    var servers = null;

    // Create the peer connections.  PC1 will be "us" and PC2 will be the mocked peer.
    peer1 = new RTCPeerConnection(servers);
    peer2 = new RTCPeerConnection(servers);

    // Add a handler for when there are new ICE candidates
    peer1.onicecandidate = function (e) {
        addCandidate(peer2, e);
    };

    peer2.onicecandidate = function (e) {
        addCandidate(peer1, e);
    };

    // Add a callback for when we get the remote stream for the 2nd peer so we can see their video
    peer2.onaddstream = function (e) {
        remoteVid.srcObject = e.stream;
    };

    // Add our local stream to peer1
    peer1.addStream(localStream);

    // Create an offer to connect
    peer1.createOffer(offerConstraints)
        .then(function (desc) {
            // The APIs for setting descriptions are promise-based.
            // For brevity, we aren't adding callbacks.
            peer1.setLocalDescription(desc);
            peer2.setRemoteDescription(desc);
            peer2.createAnswer()
                .then(createAnswerSuccess);
        });
}

/**
 * Adds a candidate to a peer connection
 * @param {RTCPeerConnection} peer 
 * @param {Object} event 
 */
function addCandidate(peer, event) {
    if (!event.candidate) { return; }
    peer.addIceCandidate(new RTCIceCandidate(event.candidate));
}

/**
 * After given an answer, we need to set the local and remote descriptions 
 * @param {Object} desc 
 */
function createAnswerSuccess(desc) {
    // Again, the description APIs are promise-based
    peer2.setLocalDescription(desc);
    peer1.setRemoteDescription(desc);
}

/**
 * Ends the call and cleans up resources.
 */
function hangup() {
    peer1.close();
    peer2.close();
    peer1 = null;
    peer2 = null;
    localVid.srcObject = null;
    remoteVid.srcObject = null;
    hangupBtn.disabled = true;
    callBtn.disabled = true;
    startBtn.disabled = false;
}
