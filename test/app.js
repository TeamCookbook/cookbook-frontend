const expect = require("chai").expect;
const requirejs = require("requirejs");

describe("Module: App", () => {
    var uut;

    before(done => {
        requirejs(["app"], function(app){
            uut = app;
            done();
        });
    });

    it("Returns an object", () => {
        expect(uut).to.be.an("object");
    });
});
