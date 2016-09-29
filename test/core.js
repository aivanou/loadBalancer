var expect = require("chai").expect;
var server = require("../src/lb/server");
var core = require("../src/lb/core");
var strategy = require('../src/lb/strategy');
var Analytics = require('../src/lb/analytics');

describe("Round Robin strategy tests", function() {
    describe("Empty set of servers", function() {
        it("Always returns undefined", function() {
            var roundRobin = new strategy([]);
            var server = roundRobin.getServer();
            expect(server).equal(undefined);
        });
    });
    describe("Set of servers always returns the next server in list", function() {
        it("Always returns undefined", function() {
            var roundRobin = new strategy(['s1', 's2', 's3', 's4']);
            expect(roundRobin.getServer()).equal('s1');
            expect(roundRobin.getServer()).equal('s2');
            expect(roundRobin.getServer()).equal('s3');
        });
    });
    describe("If the previously returned server was last in the list", function() {
        it("Always returns the first server", function() {
            var roundRobin = new strategy(['s1', 's2', 's3']);
            expect(roundRobin.getServer()).equal('s1');
            expect(roundRobin.getServer()).equal('s2');
            expect(roundRobin.getServer()).equal('s3');
            expect(roundRobin.getServer()).equal('s1');
        });
    });
    describe("If statistics enabled", function() {
        it("Should log the amount of requests", function() {
            var analytics = new Analytics();
            var roundRobin = new strategy(['s1', 's2', 's3'], analytics);
            expect(roundRobin.getServer()).equal('s1');
            expect(roundRobin.getServer()).equal('s2');
            expect(roundRobin.getServer()).equal('s3');
            expect(roundRobin.getServer()).equal('s1');
            var dict = analytics.getRequestStatistics();
            expect(dict.s1).equal(2);
            expect(dict.s2).equal(1);
            expect(dict.s3).equal(1);
        });
    });

});