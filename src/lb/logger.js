'use strict';

var bunyan = require('bunyan');
var path = require('path');
var log = bunyan.createLogger({name: "loadBalancer"});

console.log('Bunyan Config');

module.exports = log;
