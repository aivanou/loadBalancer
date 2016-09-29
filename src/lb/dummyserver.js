var http = require('http');
var request = require('request');
var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('ok');
});


app.post('/allocateStream', function(req, res) {
    res.send('{"url":"https://video1.neti.system/svt1?token=123","secret":"abcdef_sample"}');
});

var portTemplate = '-p';
var PORT = 9999;

process.argv.forEach(function(val, index, array) {
    if (val == portTemplate) {
        PORT = array[index + 1];
    }
});

var server = http.createServer(app).listen(PORT, function() {
    console.log('starting dummy server on port: ' + PORT);
});

exports.constValue = function(value) {
    return -1;
};