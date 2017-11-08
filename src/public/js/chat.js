'use strict';

/**
 * Configuration object for our STUN/TURN servers
 * @type {Object}
 */
var servers = {
    iceServers: [
        {
            url: 'stun:stun.leoreading.com'
        },
        {
            url: 'turn:stun.leoreading.com?transport=udp',
            username: 'nhjs',
            credential: 'WeLoveJavaScript'
        },
        {
            url: 'turn:stun.leoreading.com?transport=tcp',
            username: 'nhjs',
            credential: 'WeLoveJavaScript'
        }]
};

var pc = new RTCPeerConnection(servers);
