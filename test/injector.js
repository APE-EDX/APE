const inject = require('../src/inject')();
const expect = require("chai").expect;

describe("APEDLL Injector Addon", function() {
    it("loads the addon correctly", function() {
        expect(inject.injector).to.not.equal(false);
    });

    it("starts the TCP server", function() {
        var testPromise = new Promise((resolve, reject) => {
            const net = require("net");
            (new net.Socket()).connect(25100, 'localhost', () => {
                resolve(true);
            }).on('error', () => {
                resolve(false);
            });
        });

        return testPromise.then((result) => {
            expect(result).to.equal(true);
        });
    });
});
