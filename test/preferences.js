"use strict";

const MP = require("../lib/mercadopago");
const assert = require("assert");
const credentials = require("./credentials");
const _ = require('lodash');

process.setMaxListeners(0);

describe("Preferences", function(){
	let mp;

	before ("Instantitate MP", function () {
		mp = new MP(credentials.client_id, credentials.client_secret);
	});

	it("Should create, get and update a preference", function(done) {
		this.timeout(1000);

		let preferenceData = {
			"items": [
				{
					"title": "test1",
					"quantity": 1,
					"unit_price": 10.2
				}
			]
		};

		mp.createPreference(preferenceData).then(
			function (preference) {
				try {
					assert.equal(preference.status, 201);
					assert.equal(preference.response.items[0].title, "test1", "Preference title");
					assert.equal(preference.response.items[0].quantity, 1, "Preference quantity");
					assert.equal(preference.response.items[0].unit_price, 10.2, "Preference price");
					assert.equal(
					  _.includes(['ARS','BRL','VEF','CLP','MXN','COP','PEN','UYU'],
                        preference.response.items[0].currency_id),
            true,
            "Preference currency");
        } catch(e) {
					return done(e);
				}

				mp.getPreference(preference.response.id).then (
					function (preference) {
						try {
							assert.equal(preference.status, 200);
						} catch(e) {
							return done(e);
						}

						let preferenceData = {
							"items": [
								{
									"title": "test2Modified",
									"quantity": 2,
									"currency_id": "USD",
									"unit_price": 100
								}
							]
						};

						mp.updatePreference(preference.response.id, preferenceData).then (
							function (preference) {
								try {
									assert.equal(preference.status, 200);
								} catch(e) {
									return done(e);
								}

								mp.getPreference(preference.response.id).then (
									function (preference) {
										try {
											assert.equal(preference.response.items[0].title, "test2Modified", "Updated Preference title");
											assert.equal(preference.response.items[0].quantity, 2, "Updated Preference quantity");
											assert.equal(preference.response.items[0].unit_price, 100, "Updated Preference price");
											assert.equal(preference.response.items[0].currency_id, "USD", "Updated Preference currency");
										} catch(e) {
											return done(e);
										}

										done ();
									},
									done
								);
							},
							done
						);
					},
					done
				);
			},
			done
		);
	});
});