'use strict';

var config = require('config');
var http = require('http');

var Analytics = require('./analytics');
var Balancer = require('./core');
var Strategy = require('./strategy');

var express = require('express');
var app = express();

var analytics = new Analytics();
var roundRobin = new Strategy(config.get('loadbalancer.servers'), analytics);

var balancer = new Balancer({
    MAX_RETRIES: 3,
    TIMEOUT: 1000
});

app.post('/allocateStream', function(req, res) {
    balancer.process(req, res, roundRobin, 'http');
});


app.get('/statistics', function(req, res) {
    res.send(JSON.stringify(analytics.getRequestStatistics()));
});


var server = http.createServer(app).listen(process.env.PORT, function() {
    console.log('Balancer is listening on port ' + process.env.PORT);
});