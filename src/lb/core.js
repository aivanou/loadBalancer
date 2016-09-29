'use strict';

var request = require('request');
var $q = require('q');

function wrapRequest(deferred, opts) {

    var before = Date.now(),
        info = ' ' + opts.method + ' ' + opts.url;
    request(opts, function(error, response, body) {
        if (error || (response.statusCode < 200 || response.statusCode >= 400)) {
            console.error(info + ' FAILED (' + (Date.now() - before) + 'ms)');
            deferred.reject({
                error: error,
                response: response,
                body: body
            });
        } else {
            console.info(info + ' ' + response.statusCode + '(' + (Date.now() - before) + 'ms)');
            deferred.resolve({
                response: response,
                body: body
            });
        }
    });
}

function post(url, opts) {
    var deferred = $q.defer();
    if (!opts) {
        opts = {
            TIMEOUT: 1000
        };
    }

    opts.url = url;
    opts.method = 'POST';

    wrapRequest(deferred, opts);

    return deferred.promise;
}

function redirect(req, res, strategy, protocol, nretries, opts) {
    var server = strategy.getServer();
    var url = buildUrl(protocol, server, req.url);
    post(url, {
        timeout: opts.TIMEOUT
    })
        .timeout(opts.TIMEOUT)
        .then(function(result) {
            return processServerResponse(result);
        })
        .then(function(result) {
            res.send(result);
        })
        .fail(function(fail) {
            if (nretries <= 1) {
                console.log('No servers are available, sending error');
                res.status(500).send('Failed to execute request');
            } else {
                redirect(req, res, strategy, protocol, nretries - 1, opts);
            }
        });
}

function Balancer(opts) {
    this.opts = opts || {};
    if (!this.opts.MAX_RETRIES) {
        this.opts.MAX_RETRIES = 3;
    }
    if (!this.opts.TIMEOUT) {
        this.opts.TIMEOUT = 1000;
    }
}

Balancer.prototype = {
    process: function(req, res, strategy, protocol) {
        redirect(req, res, strategy, protocol, this.opts.MAX_RETRIES, this.opts);
    }
};

//Help functions

function buildUrl(protocol, host, url) {
    return protocol + '://' + host + url;
}

function processServerResponse(serverResp) {
    var body = JSON.parse(serverResp.body);
    delete body.secret;
    return JSON.stringify(body);
}


module.exports = Balancer;