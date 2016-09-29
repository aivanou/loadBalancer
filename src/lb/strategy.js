'use strict';

function Strategy(servers, analytics) {
    this.servers = servers;
    this.analytics = analytics;
}

Strategy.prototype = {

    index: 0,

    getType: function() {
        return this.type;
    },
    getServer: function() {

        var server = this.servers[this.index];
        if (this.analytics) {
            this.analytics.registerRequest(server);
        }
        this.index += 1;
        if (this.index == this.servers.length) {
            this.index = 0;
        }
        return server;
    }
};

module.exports = Strategy;