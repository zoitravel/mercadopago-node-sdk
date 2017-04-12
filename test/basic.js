"use strict";

const MP = require("../lib/mercadopago");
const MercadoPagoError = MP.MercadoPagoError;
const assert = require("assert");
const credentials = require("./../credentials");

process.setMaxListeners(0);

describe("Basic", function () {
    describe("Instantiation exception", function() {
    	function instantiate() {
    		new MP("param 1", "param 2", "param 3");
    	}

    	it("Should throw an exception because wrong parameters", function() {
    		assert.throws(instantiate, MercadoPagoError, "Error thrown");
    	});
    });

	describe("Long Live Access Token", function() {
		let mp = new MP(credentials.ACCESS_TOKEN);

		it("Should return the access_token", function (done) {
		  mp.getAccessToken()
        .then((res) => assert.equal (res, credentials.ACCESS_TOKEN))
        .then(done);
		});
	});
});
