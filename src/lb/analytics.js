'use strict';

var Dict = require("collections/dict");

function Analytics(servers) {
    this.servers = servers;
}

Analytics.prototype = {

    requestMap: new Dict({}, function(key) {
        return 0;
    }),

    registerRequest: function(server) {
        this.requestMap.add(this.requestMap.get(server) + 1, server);
    },

    getRequestStatistics: function() {
        return this.requestMap.clone().store;
    }

};

module.exports = Analytics;