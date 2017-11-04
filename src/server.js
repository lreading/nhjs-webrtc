'use strict';

const express = require('express');
const path = require('path');

const app = express();
const httpPort = 8000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(httpPort, () => {
    console.log(`Express server running on ${httpPort}`);
});
