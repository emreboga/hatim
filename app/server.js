var path = require('path');
var express = require('express');

var app = express();

app.use('/', express.static(__dirname + '/public'));

// Start the server
app.listen(2222);