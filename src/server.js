'use strict';

const express = require('express');
const path = require('path');

const app = express();
const httpPort = 8000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib', express.static(path.join(__dirname, '../node_modules/webrtc-adapter/out/')));

app.listen(httpPort, () => {
    console.log(`Express server running on ${httpPort}`);
});
