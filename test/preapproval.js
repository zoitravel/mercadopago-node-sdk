"use strict";

const MP = require("../lib/mercadopago");
const assert = require("assert");
const credentials = require("./../credentials");

process.setMaxListeners(0);

describe("Preapproval", function(){
	let mp;

	before ("Instantitate MP", function () {
		mp = new MP(credentials.ACCESS_TOKEN);
	});

	it("Should create, get and update a preapproval", function(done) {
		this.timeout(5000);

    let preferenceData = {
      "payer_email": "my_customer@my_site.com",
      "back_url": "https://www.testpreapproval.com/back_url",
      "reason": "Preapproval preference",
      "external_reference": "OP-1234",
      "auto_recurring": {
        "frequency": 1,
        "frequency_type": "months",
        "transaction_amount": 60,
        "currency_id": "ARS"
      }
    };

		mp.createPreapprovalPayment(preferenceData).then(
			function (preference) {
				try {
					assert.equal(preference.status, 201);

					assert.equal(preference.response.payer_email, "my_customer@my_site.com", "Payer email");
					assert.equal(preference.response.reason, "Preapproval preference", "Reason");
					assert.equal(preference.response.external_reference, "OP-1234", "External reference");
				} catch(e) {
					return done(e);
				}

				mp.getPreapprovalPayment(preference.response.id).then (
					function (preference) {
						try {
							assert.equal(preference.status, 200);
						} catch(e) {
							return done(e);
						}

						var preferenceData = {
				            "reason": "Preapproval preference updated",
				            "external_reference": "OP-5678"
						};

						mp.updatePreapprovalPayment(preference.response.id, preferenceData).then (
							function (preference) {
								try {
									assert.equal(preference.status, 200);
								} catch(e) {
									return done(e);
								}

								mp.getPreapprovalPayment(preference.response.id).then (
									function (preference) {
										try {
											assert.equal(preference.response.payer_email, "my_customer@my_site.com", "Payer email");
											assert.equal(preference.response.reason, "Preapproval preference updated", "Reason");
											assert.equal(preference.response.external_reference, "OP-5678", "External reference");
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